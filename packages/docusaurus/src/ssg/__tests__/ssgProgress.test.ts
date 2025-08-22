/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import {SSGProgressTracker, createSSGProgressReporter} from '../ssgProgress';

describe('SSGProgressTracker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with correct values', () => {
    const tracker = new SSGProgressTracker(100);
    const stats = tracker.getStats();
    
    expect(stats.totalPages).toBe(100);
    expect(stats.completedPages).toBe(0);
    expect(stats.failedPages).toBe(0);
    expect(stats.successRate).toBe(0);
  });

  it('should track completed pages', () => {
    const tracker = new SSGProgressTracker(10);
    
    tracker.incrementCompleted('/page1');
    tracker.incrementCompleted('/page2');
    
    const stats = tracker.getStats();
    expect(stats.completedPages).toBe(2);
    expect(stats.failedPages).toBe(0);
    expect(tracker.getProgress()).toBe(20);
  });

  it('should track failed pages', () => {
    const tracker = new SSGProgressTracker(10);
    const error = new Error('Test error');
    
    tracker.incrementFailed('/page1', error);
    tracker.incrementFailed('/page2', error);
    
    const stats = tracker.getStats();
    expect(stats.completedPages).toBe(0);
    expect(stats.failedPages).toBe(2);
    expect(tracker.getProgress()).toBe(20);
  });

  it('should calculate success rate correctly', () => {
    const tracker = new SSGProgressTracker(10);
    const error = new Error('Test error');
    
    tracker.incrementCompleted('/page1');
    tracker.incrementCompleted('/page2');
    tracker.incrementCompleted('/page3');
    tracker.incrementFailed('/page4', error);
    
    const stats = tracker.getStats();
    expect(stats.successRate).toBe(75); // 3 out of 4 processed
  });

  it('should detect completion correctly', () => {
    const tracker = new SSGProgressTracker(3);
    const error = new Error('Test error');
    
    expect(tracker.isComplete()).toBe(false);
    
    tracker.incrementCompleted('/page1');
    expect(tracker.isComplete()).toBe(false);
    
    tracker.incrementCompleted('/page2');
    expect(tracker.isComplete()).toBe(false);
    
    tracker.incrementFailed('/page3', error);
    expect(tracker.isComplete()).toBe(true);
  });

  it('should emit start event', () => {
    const tracker = new SSGProgressTracker(10);
    const mockListener = jest.fn();
    
    tracker.on('progress', mockListener);
    tracker.start();
    
    expect(mockListener).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'start',
        totalPages: 10,
        completedPages: 0,
        failedPages: 0,
      })
    );
  });

  it('should emit progress events with throttling', () => {
    const tracker = new SSGProgressTracker(10);
    const mockListener = jest.fn();
    
    tracker.on('progress', mockListener);
    
    // First call should emit
    tracker.incrementCompleted('/page1');
    expect(mockListener).toHaveBeenCalledTimes(1);
    
    // Immediate second call should not emit (throttled)
    tracker.incrementCompleted('/page2');
    expect(mockListener).toHaveBeenCalledTimes(1);
    
    // After 100ms, should emit
    jest.advanceTimersByTime(100);
    tracker.incrementCompleted('/page3');
    expect(mockListener).toHaveBeenCalledTimes(2);
  });

  it('should emit complete event when all pages are processed', () => {
    const tracker = new SSGProgressTracker(2);
    const mockListener = jest.fn();
    
    tracker.on('progress', mockListener);
    
    tracker.incrementCompleted('/page1');
    expect(mockListener).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'progress',
      })
    );
    
    jest.advanceTimersByTime(100);
    tracker.incrementCompleted('/page2');
    expect(mockListener).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'complete',
      })
    );
  });

  it('should emit error event for failed pages', () => {
    const tracker = new SSGProgressTracker(10);
    const mockListener = jest.fn();
    const error = new Error('Test error');
    
    tracker.on('progress', mockListener);
    tracker.incrementFailed('/page1', error);
    
    expect(mockListener).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        pathname: '/page1',
        error,
      })
    );
  });

  it('should calculate elapsed time', () => {
    const tracker = new SSGProgressTracker(10);
    
    const initialTime = tracker.getElapsedTime();
    expect(initialTime).toBeGreaterThanOrEqual(0);
    
    jest.advanceTimersByTime(1000);
    
    const laterTime = tracker.getElapsedTime();
    expect(laterTime).toBeGreaterThanOrEqual(1000);
  });
});

describe('createSSGProgressReporter', () => {
  let originalStdout: any;

  beforeEach(() => {
    originalStdout = process.stdout;
    // Mock stdout methods
    process.stdout.isTTY = true as any;
    process.stdout.clearLine = jest.fn() as any;
    process.stdout.cursorTo = jest.fn() as any;
    process.stdout.write = jest.fn() as any;
  });

  afterEach(() => {
    process.stdout = originalStdout;
  });

  it('should create a progress reporter with event listeners', () => {
    const reporter = createSSGProgressReporter(100);
    expect(reporter).toBeInstanceOf(SSGProgressTracker);
    expect(reporter.listenerCount('progress')).toBeGreaterThan(0);
  });

  it('should handle non-TTY environments gracefully', () => {
    process.stdout.isTTY = false as any;
    
    const reporter = createSSGProgressReporter(10);
    reporter.start();
    reporter.incrementCompleted('/page1');
    
    // Should not crash in non-TTY environment
    expect(process.stdout.clearLine).not.toHaveBeenCalled();
    expect(process.stdout.cursorTo).not.toHaveBeenCalled();
  });
});
