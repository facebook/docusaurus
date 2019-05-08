/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module 'fs-extra' {
  import type {Stats, ReadStream, WriteStream} from 'fs';

  declare export type SymlinkType = 'dir' | 'file';
  declare export type FsSymlinkType = 'dir' | 'file' | 'junction';

  declare export type CopyFilterSync = (src: string, dest: string) => boolean;
  declare export type CopyFilterAsync = (
    src: string,
    dest: string,
  ) => Promise<boolean>;

  declare export type CopyOptions = {
    dereference?: boolean,
    overwrite?: boolean,
    preserveTimestamps?: boolean,
    errorOnExist?: boolean,
    recursive?: boolean,
  };

  declare export type CopyOptionsAync = CopyOptions & {
    filter?: CopyFilterSync | CopyFilterAsync,
  };

  declare export type CopyOptionsSync = CopyOptions & {
    filter?: CopyFilterSync,
  };

  declare export type MoveOptions = {
    overwrite?: boolean,
    limit?: number,
  };

  declare export type ReadOptions = {
    throws?: boolean,
    fs?: Object,
    reviver?: any,
    encoding?: string,
    flag?: string,
  };

  declare export type WriteFileOptions = {
    encoding?: string,
    flag?: string,
    mode?: number,
  };

  declare export type WriteOptions = WriteFileOptions & {
    fs?: Object,
    replacer?: any,
    spaces?: number | string,
    EOL?: string,
  };

  declare export type ReadResult = {
    bytesRead: number,
    buffer: Buffer,
  };

  declare export type WriteResult = {
    bytesWritten: number,
    buffer: Buffer,
  };

  declare export function copy(
    src: string,
    dest: string,
    options?: CopyOptionsAync,
  ): Promise<void>;
  declare export function copy(
    src: string,
    dest: string,
    callback: (err: Error) => void,
  ): void;
  declare export function copy(
    src: string,
    dest: string,
    options: CopyOptionsAync,
    callback: (err: Error) => void,
  ): void;
  declare export function copySync(
    src: string,
    dest: string,
    options?: CopyOptionsSync,
  ): void;

  declare export function move(
    src: string,
    dest: string,
    options?: MoveOptions,
  ): Promise<void>;
  declare export function move(
    src: string,
    dest: string,
    callback: (err: Error) => void,
  ): void;
  declare export function move(
    src: string,
    dest: string,
    options: MoveOptions,
    callback: (err: Error) => void,
  ): void;
  declare export function moveSync(
    src: string,
    dest: string,
    options?: MoveOptions,
  ): void;

  declare export function createFile(file: string): Promise<void>;
  declare export function createFile(
    file: string,
    callback: (err: Error) => void,
  ): void;
  declare export function createFileSync(file: string): void;
  declare export function createReadStream(
    path: string,
    options?: Object,
  ): ReadStream;
  declare export function createWriteStream(
    path: string,
    options?: Object,
  ): WriteStream;

  declare export function ensureDir(path: string): Promise<void>;
  declare export function ensureDir(
    path: string,
    callback: (err: Error) => void,
  ): void;
  declare export function ensureDirSync(path: string): void;

  declare export function exists(path: string): Promise<boolean>;
  declare export function exists(
    path: string,
    callback?: (exists: boolean) => void,
  ): void;

  declare export function mkdirs(dir: string): Promise<void>;
  declare export function mkdirs(
    dir: string,
    callback: (err: Error) => void,
  ): void;
  declare export function mkdirsSync(dir: string): void;

  declare export function mkdirp(dir: string): Promise<void>;
  declare export function mkdirp(
    dir: string,
    callback: (err: Error) => void,
  ): void;
  declare export function mkdirpSync(dir: string): void;

  declare export function outputFile(
    file: string,
    data: any,
    options?: WriteFileOptions | string,
  ): Promise<void>;
  declare export function outputFile(
    file: string,
    data: any,
    callback: (err: Error) => void,
  ): void;
  declare export function outputFile(
    file: string,
    data: any,
    options: WriteFileOptions | string,
    callback: (err: Error) => void,
  ): void;
  declare export function outputFileSync(
    file: string,
    data: any,
    options?: WriteFileOptions | string,
  ): void;

  declare export function readJson(
    file: string,
    options?: ReadOptions,
  ): Promise<any>;
  declare export function readJson(
    file: string,
    callback: (err: Error, jsonObject: any) => void,
  ): void;
  declare export function readJson(
    file: string,
    options: ReadOptions,
    callback: (err: Error, jsonObject: any) => void,
  ): void;
  declare export function readJSON(
    file: string,
    options?: ReadOptions,
  ): Promise<any>;
  declare export function readJSON(
    file: string,
    callback: (err: Error, jsonObject: any) => void,
  ): void;
  declare export function readJSON(
    file: string,
    options: ReadOptions,
    callback: (err: Error, jsonObject: any) => void,
  ): void;

  declare export function readJsonSync(
    file: string,
    options?: ReadOptions,
  ): any;
  declare export function readJSONSync(
    file: string,
    options?: ReadOptions,
  ): any;

  declare export function remove(dir: string): Promise<void>;
  declare export function remove(
    dir: string,
    callback: (err: Error) => void,
  ): void;
  declare export function removeSync(dir: string): void;

  declare export function outputJson(
    file: string,
    data: any,
    options?: WriteOptions,
  ): Promise<void>;
  declare export function outputJSON(
    file: string,
    data: any,
    options?: WriteOptions,
  ): Promise<void>;
  declare export function outputJson(
    file: string,
    data: any,
    options: WriteOptions,
    callback: (err: Error) => void,
  ): void;
  declare export function outputJSON(
    file: string,
    data: any,
    options: WriteOptions,
    callback: (err: Error) => void,
  ): void;
  declare export function outputJson(
    file: string,
    data: any,
    callback: (err: Error) => void,
  ): void;
  declare export function outputJSON(
    file: string,
    data: any,
    callback: (err: Error) => void,
  ): void;
  declare export function outputJsonSync(
    file: string,
    data: any,
    options?: WriteOptions,
  ): void;
  declare export function outputJSONSync(
    file: string,
    data: any,
    options?: WriteOptions,
  ): void;

  declare export function writeJSON(
    file: string,
    object: any,
    options?: WriteOptions,
  ): Promise<void>;
  declare export function writeJSON(
    file: string,
    object: any,
    callback: (err: Error) => void,
  ): void;
  declare export function writeJSON(
    file: string,
    object: any,
    options: WriteOptions,
    callback: (err: Error) => void,
  ): void;
  declare export function writeJson(
    file: string,
    object: any,
    options?: WriteOptions,
  ): Promise<void>;
  declare export function writeJson(
    file: string,
    object: any,
    callback: (err: Error) => void,
  ): void;
  declare export function writeJson(
    file: string,
    object: any,
    options: WriteOptions,
    callback: (err: Error) => void,
  ): void;

  declare export function writeJsonSync(
    file: string,
    object: any,
    options?: WriteOptions,
  ): void;
  declare export function writeJSONSync(
    file: string,
    object: any,
    options?: WriteOptions,
  ): void;

  declare export function ensureFile(path: string): Promise<void>;
  declare export function ensureFile(
    path: string,
    callback: (err: Error) => void,
  ): void;
  declare export function ensureFileSync(path: string): void;

  declare export function ensureLink(src: string, dest: string): Promise<void>;
  declare export function ensureLink(
    src: string,
    dest: string,
    callback: (err: Error) => void,
  ): void;
  declare export function ensureLinkSync(src: string, dest: string): void;

  declare export function ensureSymlink(
    src: string,
    dest: string,
    type?: SymlinkType,
  ): Promise<void>;
  declare export function ensureSymlink(
    src: string,
    dest: string,
    type: SymlinkType,
    callback: (err: Error) => void,
  ): void;
  declare export function ensureSymlink(
    src: string,
    dest: string,
    callback: (err: Error) => void,
  ): void;
  declare export function ensureSymlinkSync(
    src: string,
    dest: string,
    type?: SymlinkType,
  ): void;

  declare export function emptyDir(path: string): Promise<void>;
  declare export function emptyDir(
    path: string,
    callback: (err: Error) => void,
  ): void;
  declare export function emptyDirSync(path: string): void;

  declare export function pathExists(path: string): Promise<boolean>;
  declare export function pathExists(
    path: string,
    callback: (err: Error, exists: boolean) => void,
  ): void;
  declare export function pathExistsSync(path: string): boolean;

  declare export function access(
    path: string | Buffer,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function access(
    path: string | Buffer,
    mode: number,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function access(
    path: string | Buffer,
    mode?: number,
  ): Promise<void>;

  declare export function appendFile(
    file: string | Buffer | number,
    data: any,
    options: {encoding?: string, mode?: number | string, flag?: string},
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function appendFile(
    file: string | Buffer | number,
    data: any,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function appendFile(
    file: string | Buffer | number,
    data: any,
    options?: {encoding?: string, mode?: number | string, flag?: string},
  ): Promise<void>;

  declare export function chmod(
    path: string | Buffer,
    mode: string | number,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function chmod(
    path: string | Buffer,
    mode: string | number,
  ): Promise<void>;

  declare export function chown(
    path: string | Buffer,
    uid: number,
    gid: number,
  ): Promise<void>;
  declare export function chown(
    path: string | Buffer,
    uid: number,
    gid: number,
    callback: (err: ErrnoError) => void,
  ): void;

  declare export function close(
    fd: number,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function close(fd: number): Promise<void>;

  declare export function fchmod(
    fd: number,
    mode: string | number,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function fchmod(
    fd: number,
    mode: string | number,
  ): Promise<void>;

  declare export function fchown(
    fd: number,
    uid: number,
    gid: number,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function fchown(
    fd: number,
    uid: number,
    gid: number,
  ): Promise<void>;

  declare export function fdatasync(fd: number, callback: () => void): void;
  declare export function fdatasync(fd: number): Promise<void>;

  declare export function fstat(
    fd: number,
    callback: (err: ErrnoError, stats: Stats) => any,
  ): void;
  declare export function fstat(fd: number): Promise<Stats>;

  declare export function fsync(
    fd: number,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function fsync(fd: number): Promise<void>;

  declare export function ftruncate(
    fd: number,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function ftruncate(
    fd: number,
    len: number,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function ftruncate(fd: number, len?: number): Promise<void>;

  declare export function futimes(
    fd: number,
    atime: number,
    mtime: number,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function futimes(
    fd: number,
    atime: Date,
    mtime: Date,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function futimes(
    fd: number,
    atime: number,
    mtime: number,
  ): Promise<void>;
  declare export function futimes(
    fd: number,
    atime: Date,
    mtime: Date,
  ): Promise<void>;

  declare export function lchown(
    path: string | Buffer,
    uid: number,
    gid: number,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function lchown(
    path: string | Buffer,
    uid: number,
    gid: number,
  ): Promise<void>;

  declare export function link(
    srcpath: string | Buffer,
    dstpath: string | Buffer,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function link(
    srcpath: string | Buffer,
    dstpath: string | Buffer,
  ): Promise<void>;

  declare export function lstat(
    path: string | Buffer,
    callback: (err: ErrnoError, stats: Stats) => any,
  ): void;
  declare export function lstat(path: string | Buffer): Promise<Stats>;

  declare export function mkdir(
    path: string | Buffer,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function mkdir(
    path: string | Buffer,
    mode: number | string,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function mkdir(path: string | Buffer): Promise<void>;

  declare export function open(
    path: string | Buffer,
    flags: string | number,
    callback: (err: ErrnoError, fd: number) => void,
  ): void;
  declare export function open(
    path: string | Buffer,
    flags: string | number,
    mode: number,
    callback: (err: ErrnoError, fd: number) => void,
  ): void;
  declare export function open(
    path: string | Buffer,
    flags: string | number,
    mode?: number,
  ): Promise<number>;

  declare export function read(
    fd: number,
    buffer: Buffer,
    offset: number,
    length: number,
    position: number | null,
    callback: (err: ErrnoError, bytesRead: number, buffer: Buffer) => void,
  ): void;
  declare export function read(
    fd: number,
    buffer: Buffer,
    offset: number,
    length: number,
    position: number | null,
  ): Promise<ReadResult>;

  declare export function readFile(
    file: string | Buffer | number,
    callback: (err: ErrnoError, data: Buffer) => void,
  ): void;
  declare export function readFile(
    file: string | Buffer | number,
    encoding: string,
    callback: (err: ErrnoError, data: string) => void,
  ): void;
  declare export function readFile(
    file: string | Buffer | number,
    options: {flag?: string} | {encoding: string, flag?: string},
    callback: (err: ErrnoError, data: Buffer) => void,
  ): void;
  declare export function readFile(
    file: string | Buffer | number,
    options: {flag?: string} | {encoding: string, flag?: string},
  ): Promise<string>;
  declare export function readFile(
    file: string | Buffer | number,
    encoding: string,
  ): Promise<string>;
  declare export function readFile(
    file: string | Buffer | number,
  ): Promise<Buffer>;

  declare export function readdir(
    path: string | Buffer,
    callback: (err: ErrnoError, files: string[]) => void,
  ): void;
  declare export function readdir(path: string | Buffer): Promise<string[]>;

  declare export function readlink(
    path: string | Buffer,
    callback: (err: ErrnoError, linkString: string) => any,
  ): void;
  declare export function readlink(path: string | Buffer): Promise<string>;

  declare export function realpath(
    path: string | Buffer,
    callback: (err: ErrnoError, resolvedPath: string) => any,
  ): void;
  declare export function realpath(
    path: string | Buffer,
    cache: {[path: string]: string},
    callback: (err: ErrnoError, resolvedPath: string) => any,
  ): void;
  declare export function realpath(
    path: string | Buffer,
    cache?: {[path: string]: string},
  ): Promise<string>;

  declare export function rename(
    oldPath: string,
    newPath: string,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function rename(
    oldPath: string,
    newPath: string,
  ): Promise<void>;

  declare export function rmdir(
    path: string | Buffer,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function rmdir(path: string | Buffer): Promise<void>;

  declare export function stat(
    path: string | Buffer,
    callback: (err: ErrnoError, stats: Stats) => any,
  ): void;
  declare export function stat(path: string | Buffer): Promise<Stats>;

  declare export function statSync(path: string): Stats;

  declare export function symlink(
    srcpath: string | Buffer,
    dstpath: string | Buffer,
    type: FsSymlinkType | void,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function symlink(
    srcpath: string | Buffer,
    dstpath: string | Buffer,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function symlink(
    srcpath: string | Buffer,
    dstpath: string | Buffer,
    type?: FsSymlinkType,
  ): Promise<void>;

  declare export function truncate(
    path: string | Buffer,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function truncate(
    path: string | Buffer,
    len: number,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function truncate(
    path: string | Buffer,
    len?: number,
  ): Promise<void>;

  declare export function unlink(
    path: string | Buffer,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function unlink(path: string | Buffer): Promise<void>;

  declare export function utimes(
    path: string | Buffer,
    atime: number,
    mtime: number,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function utimes(
    path: string | Buffer,
    atime: Date,
    mtime: Date,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function utimes(
    path: string | Buffer,
    atime: number,
    mtime: number,
  ): Promise<void>;
  declare export function utimes(
    path: string | Buffer,
    atime: Date,
    mtime: Date,
  ): Promise<void>;

  declare export function write(
    fd: number,
    buffer: Buffer,
    offset: number,
    length: number,
    position: number | null,
    callback: (err: ErrnoError, written: number, buffer: Buffer) => void,
  ): void;
  declare export function write(
    fd: number,
    buffer: Buffer,
    offset: number,
    length: number,
    callback: (err: ErrnoError, written: number, buffer: Buffer) => void,
  ): void;
  declare export function write(
    fd: number,
    data: any,
    callback: (err: ErrnoError, written: number, str: string) => void,
  ): void;
  declare export function write(
    fd: number,
    data: any,
    offset: number,
    callback: (err: ErrnoError, written: number, str: string) => void,
  ): void;
  declare export function write(
    fd: number,
    data: any,
    offset: number,
    encoding: string,
    callback: (err: ErrnoError, written: number, str: string) => void,
  ): void;
  declare export function write(
    fd: number,
    buffer: Buffer,
    offset: number,
    length: number,
    position?: number | null,
  ): Promise<WriteResult>;
  declare export function write(
    fd: number,
    data: any,
    offset: number,
    encoding?: string,
  ): Promise<WriteResult>;

  declare export function writeFile(
    file: string | Buffer | number,
    data: any,
    callback: (err: ErrnoError) => void,
  ): void;
  declare export function writeFile(
    file: string | Buffer | number,
    data: any,
    options?: WriteFileOptions | string,
  ): Promise<void>;
  declare export function writeFile(
    file: string | Buffer | number,
    data: any,
    options: WriteFileOptions | string,
    callback: (err: ErrnoError) => void,
  ): void;

  declare export function mkdtemp(prefix: string): Promise<string>;
  declare export function mkdtemp(
    prefix: string,
    callback: (err: ErrnoError, folder: string) => void,
  ): void;
}
