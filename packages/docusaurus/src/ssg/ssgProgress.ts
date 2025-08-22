/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {EventEmitter} from 'events';
import logger from '@docusaurus/logger';

export type SSGProgressEvent = {
  type: 'start' | 'progress' | 'complete' | 'error';
  totalPages: number;
  completedPages: number;
  failedPages: number;
  pathname?: string;
  error?: Error;
};

export class SSGProgressTracker extends EventEmitter {
  private totalPages: number;
  private completedPages: number;
  private failedPages: number;
  private startTime: number;
  private lastProgressUpdate: number;
  private progressUpdateInterval: number;

  constructor(totalPages: number) {
    super();
    this.totalPages = totalPages;
    this.completedPages = 0;
    this.failedPages = 0;
    this.startTime = Date.now();
    this.lastProgressUpdate = Date.now();
    // Update progress at most once every 100ms to avoid console spam
    this.progressUpdateInterval = 100;
  }

  start(): void {
    this.emit('progress', {
      type: 'start',
      totalPages: this.totalPages,
      completedPages: 0,
      failedPages: 0,
    } as SSGProgressEvent);
  }

  incrementCompleted(pathname: string): void {
    this.completedPages++;
    this.maybeEmitProgress(pathname);
  }

  incrementFailed(pathname: string, error: Error): void {
    this.failedPages++;
    this.emit('progress', {
      type: 'error',
      totalPages: this.totalPages,
      completedPages: this.completedPages,
      failedPages: this.failedPages,
      pathname,
      error,
    } as SSGProgressEvent);
    this.maybeEmitProgress(pathname);
  }

  private maybeEmitProgress(pathname: string): void {
    const now = Date.now();
    const shouldUpdate = 
      now - this.lastProgressUpdate >= this.progressUpdateInterval ||
      this.isComplete();

    if (shouldUpdate) {
      this.lastProgressUpdate = now;
      this.emit('progress', {
        type: this.isComplete() ? 'complete' : 'progress',
        totalPages: this.totalPages,
        completedPages: this.completedPages,
        failedPages: this.failedPages,
        pathname,
      } as SSGProgressEvent);
    }
  }

  isComplete(): boolean {
    return this.completedPages + this.failedPages >= this.totalPages;
  }

  getElapsedTime(): number {
    return Date.now() - this.startTime;
  }

  getProgress(): number {
    return ((this.completedPages + this.failedPages) / this.totalPages) * 100;
  }

  getStats(): {
    totalPages: number;
    completedPages: number;
    failedPages: number;
    successRate: number;
    elapsedTime: number;
  } {
    const processedPages = this.completedPages + this.failedPages;
    return {
      totalPages: this.totalPages,
      completedPages: this.completedPages,
      failedPages: this.failedPages,
      successRate: processedPages > 0 ? (this.completedPages / processedPages) * 100 : 0,
      elapsedTime: this.getElapsedTime(),
    };
  }
}

export function createSSGProgressReporter(totalPages: number): SSGProgressTracker {
  const tracker = new SSGProgressTracker(totalPages);
  
  tracker.on('progress', (event: SSGProgressEvent) => {
    switch (event.type) {
      case 'start':
        logger.info`Generating static files for ${logger.num(totalPages)} pages...`;
        break;
      case 'progress': {
        const percentage = Math.floor(((event.completedPages + event.failedPages) / event.totalPages) * 100);
        const progressBar = createProgressBar(percentage);
        
        // Clear line and write progress
        if (process.stdout.isTTY) {
          process.stdout.clearLine(0);
          process.stdout.cursorTo(0);
          process.stdout.write(
            `${progressBar} ${percentage}% | ${event.completedPages + event.failedPages}/${event.totalPages} pages`
          );
        }
        break;
      }
      case 'complete': {
        if (process.stdout.isTTY) {
          process.stdout.clearLine(0);
          process.stdout.cursorTo(0);
        }
        const stats = tracker.getStats();
        const timeInSeconds = (stats.elapsedTime / 1000).toFixed(2);
        
        if (stats.failedPages === 0) {
          logger.success`Generated static files for ${logger.num(stats.completedPages)} pages in ${logger.num(timeInSeconds)}s.`;
        } else {
          logger.warn`Generated static files: ${logger.num(stats.completedPages)} succeeded, ${logger.num(stats.failedPages)} failed (total: ${logger.num(stats.totalPages)}) in ${logger.num(timeInSeconds)}s.`;
        }
        break;
      }
      case 'error':
        // Individual errors are logged separately in the SSG process
        break;
    }
  });
  
  return tracker;
}

function createProgressBar(percentage: number): string {
  const width = 30;
  const filled = Math.floor((percentage / 100) * width);
  const empty = width - filled;
  return `[${logger.green('█'.repeat(filled))}${'░'.repeat(empty)}]`;
}
