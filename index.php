<?php

/* Files Gallery 0.11.0
www.files.gallery | www.files.gallery/docs/ | www.files.gallery/docs/license/
---
This PHP file is only 10% of the application, used only to connect with the file system. 90% of the codebase, including app logic, interface, design and layout is managed by the app Javascript and CSS files.
---
class Config        / load config with static methods to access config options
class Login         / check and manage logins
class U             / static utility functions
class Path          / static functions to convert and validate file paths
class Json          / JSON response functions
class X3            / helper functions when running Files Gallery alongside X3 www.photo.gallery
class Tests         / outputs PHP, server and config diagnostics by url ?action=tests
class FileResponse  / outputs file, video preview image, resized image and proxies any file by PHP
class ResizeImage   / serves a resized image
class Dirs          / outputs menu json from dir structure
class Dir           / loads data array for a single dir
class File          / returns data array for a single file
class Iptc          / extract IPTC image data from images
class Exif          / extract Exif image data from images
class Filemanager   / functions that handle file operations on server
class Zipper        / create and extract zip files
class Request       / extract parameters for all actions
class Document      / creates the main Files Gallery document response
*/

// class Config / constructor and static methods to access config options
class Config {

  // config defaults / https://www.files.gallery/docs/config/
  // Only edit directly here if it is a temporary installation. Settings here will be lost when updating!
  // Instead, add options into external config file in your storage_path _files/config/config.php (generated on first run)
  private static $default = [
    'root' => '',
    'root_url_path' => null,
    'start_path' => false,
    'username' => '',
    'password' => '',
    'load_images' => true,
    'load_files_proxy_php' => false,
    'load_images_max_filesize' => 1000000,
    'image_resize_enabled' => true,
    'image_resize_cache' => true,
    'image_resize_dimensions' => 320,
    'image_resize_dimensions_retina' => 480,
    'image_resize_dimensions_allowed' => '',
    'image_resize_types' => 'jpeg, png, gif, webp, bmp, avif',
    'image_resize_quality' => 85,
    'image_resize_function' => 'imagecopyresampled',
    'image_resize_sharpen' => true,
    'image_resize_memory_limit' => 256,
    'image_resize_max_pixels' => 60000000,
    'image_resize_min_ratio' => 1.5,
    'image_resize_cache_direct' => false,
    'folder_preview_image' => true,
    'folder_preview_default' => '_filespreview.jpg',
    'menu_enabled' => true,
    'menu_max_depth' => 5,
    'menu_sort' => 'name_asc',
    'menu_cache_validate' => true,
    'menu_load_all' => false,
    'menu_recursive_symlinks' => true,
    'layout' => 'rows',
    'cache' => true,
    'cache_key' => 0,
    'storage_path' => '_files',
    'files_exclude' => '',
    'dirs_exclude' => '',
    'allow_symlinks' => true,
    'get_mime_type' => false,
    'license_key' => '',
    'download_dir' => 'browser',
    'download_dir_cache' => 'dir',
    'assets' => '',
    'allow_all' => false,
    'allow_upload' => false,
    'allow_delete' => false,
    'allow_rename' => false,
    'allow_new_folder' => false,
    'allow_new_file' => false,
    'allow_duplicate' => false,
    'allow_text_edit' => false,
    'allow_zip' => false,
    'allow_unzip' => false,
    'allow_move' => false,
    'allow_copy' => false,
    'allow_download' => true,
    'allow_mass_download' => false,
    'allow_mass_copy_links' => false,
    'allow_check_updates' => false,
    'allow_tests' => true,
    'allow_tasks' => false,
    'demo_mode' => false,
    'upload_allowed_file_types' => '',
    'upload_max_filesize' => 0,
    'upload_exists' => 'increment',
    'video_thumbs' => true,
    'video_ffmpeg_path' => 'ffmpeg',
    'pdf_thumbs' => true,
    'imagemagick_path' => 'magick',
    'use_google_docs_viewer' => false,
    'lang_default' => 'en',
    'lang_auto' => true,
  ];

  // global application variables created on new Config()
  public static $version = '0.11.0';   // Files Gallery version
  public static $config = [];         // config array merged from _filesconfig.php, config.php and default config
  public static $localconfigpath = '_filesconfig.php'; // optional config file in current dir, useful when overriding shared configs
  public static $localconfig = [];    // config array from localconfigpath
  public static $storagepath;         // absolute storage path for cache, config, plugins and more, normally _files dir
  public static $storageconfigpath;   // absolute path to storage config, normally _files/config/config.php
  public static $storageconfig = [];  // config array from storage path, normally _files/config/config.php
  public static $cachepath;           // absolute cache path shortcut
  public static $__dir__;             // absolute __DIR__ path with normalized OS path
  public static $__file__;            // absolute __FILE__ path with normalized OS path
  public static $root;                // absolute root path interpolated from config root option, normally current dir
  public static $document_root;       // absolute server document root with normalized OS path
  public static $is_logged_in;        // detect if user is logged in
  public static $created = [];        // checks what dirs and files get created by config on ?action=tests

  // config construct created static app vars and merge configs
  public function __construct() {

    // get absolute __DIR__ and __FILE__ paths with normalized OS paths
    self::$__dir__ = Path::realpath(__DIR__);
    self::$__file__ = Path::realpath(__FILE__);

    // load local config _filesconfig.php if exists
    self::$localconfig = $this->load(self::$localconfigpath);

    // create initial config array from default and localconfig
    self::$config = array_replace(self::$default, self::$localconfig);

    // set absolute storagepath, create storage dirs if required, and load, create or update storage config.php
    $this->storage();

    // at this point we must check if login is required or user is already logged in, and then merge user config
    new Login();

    // assign public real root path
    self::$root = Path::realpath(self::get('root'));

    // error if root path does not exist
    if(!self::$root) U::error('root dir <b>' . self::get('root') . '</b> does not exist');

    // storagepath can't be the same as root dir, because storage_path is excluded
    if(self::$storagepath === self::$root) U::error('storage_path can\'t be the same as root');

    // get server document root with normalized OS path
    self::$document_root = Path::realpath($_SERVER['DOCUMENT_ROOT']);

    // assign public $is_logged_in if username or password or X3 login (plugin)
    self::$is_logged_in = self::get('username') || self::get('password');// || X3::login();
  }

  // public shortcut function to get config option Config::get('option')
  public static function get($option){
    return self::$config[$option];
  }

  // load a config file and trim values / returns empty array if file doesn't exist
  private function load($path) {
    if(empty($path) || !file_exists($path)) return [];
    $config = include $path;
    if(empty($config) || !is_array($config)) return [];
    return array_map(function($v){
      return is_string($v) ? trim($v) : $v;
    }, $config);
  }

  // set storagepath from config, create dir if necessary
  private function storage(){

    // ignore storagepath and disable cache settings if storage_path is specifically set to FALSE
    if(self::get('storage_path') === false) {
      foreach (['cache', 'image_resize_cache', 'folder_preview_image'] as $key) self::$config[$key] = false;
      return;
    }

    // shortcut to config storage_path
    $path = rtrim(self::get('storage_path'), '\/');

    // invalid config storage_path can't be empty or non-string
    if(!$path || !is_string($path)) U::error('Invalid storage_path parameter');

    // get request ?action if any, to determine if we attempt to make dirs and files on config construct
    $action = U::get('action');

    // if ?action=tests, check what dirs and files will get created, for tests output
    if($action === 'tests') {
      foreach (['', '/config', '/config/config.php', '/cache/images', '/cache/folders', '/cache/menu'] as $key) {
        if(!file_exists($path . $key)) self::$created[] = $path . $key;
      }
    }

    // only make dirs and config if main document (no ?action, except action tests)
    $make = !$action || $action === 'tests';

    // make storage path dir if it doesn't exist or return error
    if($make) U::mkdir($path);

    // store absolute storagepath
    self::$storagepath = Path::realpath($path);

    // error in case storagepath still doesn't seem to exist from realpath()
    if(!self::$storagepath) U::error('storage_path does not exist and can\'t be created');

    // absolute cache path shortcut
    self::$cachepath = self::$storagepath . '/cache';

    // assign storage config path (normally */_files/config/config.php), from where we load config and save options
    self::$storageconfigpath = self::$storagepath . '/config/config.php';

    // load storage config (normally _files/config/config.php) or return empty array
    self::$storageconfig = $this->load(self::$storageconfigpath);

    // if storage config is not empty, update config by merging default, storageconfig and localconfig
    if(!empty(self::$storageconfig)) self::$config = array_replace(self::$default, self::$storageconfig, self::$localconfig);

    // only make storage dirs and config.php if main document or ?action=tests
    if(!$make) return;

    // create required storage dirs if they don't exist / error on fail
    foreach (['config', 'cache/images', 'cache/folders', 'cache/menu'] as $dir) U::mkdir(self::$storagepath . '/' . $dir);

    // create or update config file if older than index.php
    if(!file_exists(self::$storageconfigpath) || filemtime(self::$storageconfigpath) < filemtime(__FILE__)) self::save();
  }

  // save to config.php in storagepath (normally _files/config/config.php) or create new config.php if file doesn't exist
  public static function save($options = []){

    // merge array of parameters with current storageconfig, and intersect with default, to remove invalida/outdated options
    $save = array_intersect_key(array_replace(self::$storageconfig, $options), self::$default);

    // create exported array string with save values merged into default values, all commented out
    $export = preg_replace("/  '/", "  //'", var_export(array_replace(self::$default, $save), true));

    // loop save options and un-comment options where values differ from default options (for convenience, only store differences)
    foreach ($save as $key => $value) if($value !== self::$default[$key]) $export = str_replace("//'" . $key, "'" . $key, $export);

    // write formatted config array to config (normally _files/config/config.php)
    return @file_put_contents(self::$storageconfigpath, '<?php ' . PHP_EOL . PHP_EOL . '// CONFIG / https://www.files.gallery/docs/config/' . PHP_EOL . '// Uncomment the parameters you want to edit.' . PHP_EOL . 'return ' . $export . ';');
  }
}

// class Login / check and manage login
class Login {

  // vars
  private $user; // config array for logged in user, will merge with main config
  private $has_public_login; // public (default config) login exists / in this case, login is required

  // start new login check process
  public function __construct() {

    // public (default config) login exists / in this case, login is required / also check X3:login() plugin
    $this->has_public_login = Config::get('username') && Config::get('password') ? true : X3::login();

    // check if there is any login, from default config or users, so we can check session and login attempt or show login form
    if(!$this->has_public_login && !$this->users_dir()){
      // unset session token in case it remains in any active session for some reason (probably shouldn't happen)
      if(isset($_SESSION['token'])) unset($_SESSION['token']);
      return;
    }

    // PHP session_start() or error
    // check active sessions, session token on login attempt or assign session token on login form
    if(session_status() === PHP_SESSION_NONE && !session_start()) U::error('Failed to initiate PHP session_start()', 500);

    // check if browser is already logged in by session
    if($this->is_logged_in()){
      // allow ?logout=1 only if user is already logged in
      if(U::get('logout')) return $this->form();
      // merge user config and continue
      return $this->login();
    }

    // ?login=1 displays login form, if user is not already logged in
    // this only applies when login is not required !$this->has_public_login, else the login form will always display
    if(U::get('login')) return $this->form();

    // detect $_POST login attempt
    if($this->is_login_attempt()) {

      // on successful login, merge user config and continue
      if($this->is_successful_login()) return $this->login();

    // if default config is without login, serve request without login
    } else if(!$this->has_public_login){
      return;
    }

    // return error if request is an action (don't display login form)
    if($this->action_request()) return;

    // display form if not logged in or login failed attempt
    $this->form();
  }

  // check if _files/users dir exists and return path
  private function users_dir(){
    return Config::$storagepath && file_exists(Config::$storagepath . '/users') ? Config::$storagepath . '/users' : false;
  }

  // check if user is already logged in by session
  private function is_logged_in(){

    // exit if session username or login hash is not set
    if(!isset($_SESSION['username']) || !isset($_SESSION['login'])) return false;

    // get user config from $_SESSION username
    $this->user = $this->get_user($_SESSION['username']);

    // logged in if user found login hash matches session login hash
    // may fail if user is deleted or username/password/IP/user-agent/app-location changes
    return $this->user && $this->equals($this->login_hash($this->user), $_SESSION['login']);
  }

  // detect login attempt
  private function is_login_attempt(){

    // on javascript fetch() from non-login interface, we must populate $_POST from php://input
    if(U::get('action') === 'login' && empty($_POST)) $_POST = @json_decode(@trim(@file_get_contents('php://input')), true);

    // is login attempt if $_POST['fusername']
    return !!U::post('fusername');
  }

  // detect successful login attempt
  private function is_successful_login(){

    // login attempt if fusername, fpassword and token in $_POST and 'token' exists in $_SESSION
    if(!U::post('fusername') || !U::post('fpassword') || !U::post('token') || !isset($_SESSION['token'])) return false;

    // make sure $_SESSION token matches $_POST token
    if(!$this->equals($_SESSION['token'], U::post('token'))) return false;

    // get user config from $_POST username
    $this->user = $this->get_user($_POST['fusername']);

    // exit if can't find user or password doesn't match
    if(!$this->user || !$this->passwords_match($this->user['password'], $_POST['fpassword'])) return false;

    // store username in session
    $_SESSION['username'] = $this->user['username'];

    // store login hash specific to user, must match on active sessions
    $_SESSION['login'] = $this->login_hash($this->user);

    // successfull login
    return true;
  }

  // successfully logged in by session or login attempt
  private function login(){

    // list of excluded user config options because they should be global or have no function for user or could cause harm
    // you can add your own options here if you want to prevent some options from being changed per user
    $user_exclude = [
      'image_resize_dimensions',          // should not change per user as it invalidates shared image cache
      'image_resize_dimensions_retina',   // should not change per user as it invalidates shared image cache
      'image_resize_dimensions_allowed',  // should not change per user as it invalidates shared image cache
      'image_resize_quality',             // should not change per user as it invalidates shared image cache
      'image_resize_function',            // should not change per user as it invalidates shared image cache
      'image_resize_sharpen',             // should not change per user as it invalidates shared image cache
      'storage_path',                     // storage path is always global and must be defined in main config
      'video_ffmpeg_path',                // should be in global config
      'imagemagick_path',                 // should be in global config
    ];

    // merge user config into config object
    Config::$config = array_replace(Config::$config, array_diff_key($this->user, array_flip($user_exclude)));
  }

  // get user config from login attempt or session
  private function get_user($username){

    // trim username just in case
    $username = trim($username);

    // create lowercase username for case-insensitive comparison
    $lower_username = $this->lower($username);

    // user equals default config user / return username/password array to verify password or session login
    if($this->lower(Config::get('username')) === $lower_username) return [
      'username' => Config::get('username'),
      'password' => Config::get('password')
    ];

    // exit it _files/users dir doesn't exist
    if(!$this->users_dir()) return false;

    // check if user config exists at _files/users/$username/config.php without making case-insensitive lookup
    // this should apply in most cases when username is input in identical case or from $_SESSION['username']
    // Mac OS will find user case-insensitive, but that's fine as it doesn't then matter how $_SESSION['username'] is stored
    $user = $this->get_user_config($username);
    if($user) return $user;

    // loop user dirs and make case-insensitive username comparison
    foreach (glob($this->users_dir() . '/*', GLOB_ONLYDIR|GLOB_NOSORT) as $dir) {
      $arr = explode('/', $dir);  // get basename, better than basename() in case of multibyte chars
      $dirname = end($arr);       // get basename, better than basename() in case of multibyte chars
      // case-insensitive username matches user dir, get user config from $dirname with case in tact (for $_SESSION['username'])
      if($lower_username === $this->lower($dirname)) return $this->get_user_config($dirname);
    }
  }

  // get user config.php file for a specific user $dirname
  private function get_user_config($dirname){
    $user = U::uinclude("users/$dirname/config.php"); // return user config array
    if(!$user) return; // exit if not found
    // error if the user array does not contain password *required
    if(empty($user['password'])) return $this->error('User does not have valid password');
    // return user array merged with username, which is used for $_SESSION['login'] login_hash()
    return array_replace($user, ['username' => $dirname]);
  }

  // creates a login hash unique for username/password/IP/user-agent/app-location
  private function login_hash($user){
    return md5($user['username'] . $user['password'] . $this->ip() . $this->server('HTTP_USER_AGENT') . __FILE__);
  }

  // compares strings with more secure hash_equals() function (PHP >= 5.6)
  private function equals($secret, $user){
    return function_exists('hash_equals') ? hash_equals($secret, $user) : $secret === $user;
  }

  // match passwords using password_verify() if password is encrypted else use plain equality matching for non-encrypted passwords
  private function passwords_match($stored, $posted){
    if(password_get_info($stored)['algoName'] === 'unknown') return $this->equals($stored, $posted);
    return password_verify($posted, $stored);
  }

  // get client IP for login hash matching
  private function ip(){
    foreach(['HTTP_CLIENT_IP','HTTP_X_FORWARDED_FOR','HTTP_X_FORWARDED','HTTP_FORWARDED_FOR','HTTP_FORWARDED','REMOTE_ADDR'] as $key){
      $ip = explode(',', $this->server($key))[0];
      if($ip && filter_var($ip, FILTER_VALIDATE_IP)) return $ip;
    }
    return ''; // return empty string if nothing found
  }

  // get $_SERVER parameters helpers
  private function server($str){
    return isset($_SERVER[$str]) ? $_SERVER[$str] : '';
  }

  // lowercase username for case-insensitive username validation uses mb_strtolower() if function exists
  private function lower($str){
    return function_exists('mb_strtolower') ? mb_strtolower($str) : strtolower($str);
  }

  // check if request is an action, in which case we return error instead of the form
  private function action_request(){

    // exit if !action (or action is "tests", which requires login from the form)
    if(!U::get('action') || U::get('action') === 'tests') return false;

    // return json error if request is POST
    if($_SERVER['REQUEST_METHOD'] === 'POST') return Json::error('login');

    // login error with login link
    U::error('Please <a href="' . strtok($_SERVER['REQUEST_URI'], '?') . '">login</a> to continue', 401);
  }

  // login page / output form html and exit
  private function form() {

    // get form alert caused by logout, invalid session or incorrect login, before we destroy sessions vars
    $alert = $this->get_form_alert();

    // destroy login-specific session vars on logout or if they are invalid / session_unset()
    foreach (['username', 'login'] as $key) unset($_SESSION[$key]);

    // assign session token to match on login attempt for basic login security
    if(!isset($_SESSION['token'])) $_SESSION['token'] = bin2hex(function_exists('random_bytes') ? random_bytes(32) : openssl_random_pseudo_bytes(32));

    // get login form page header
    U::html_header('Login', 'page-login');

    // login page html
    // block simple bots by injecting form via javascript, add action and method on submit
    ?><body class="page-login-body">
      <article class="login-container"></article>
    </body>
    <script>
      const url = location.pathname + (location.search || '').replace(/(logout|login)=(1|true)(&?|$)/g, '').replace(/(\?|&)$/, '');
      document.querySelector('.login-container').innerHTML = `
      <h1>Login</h1>
      <?php echo $alert; ?>
      <form class="login-form">
        <input type="text" class="input" name="fusername" placeholder="Username" required autofocus spellcheck="false" autocorrect="off" autocapitalize="off" autocomplete="off">
        <input type="password" class="input" name="fpassword" placeholder="Password" required spellcheck="false" autocomplete="off">
        <input type="hidden" name="token" value="<?php echo $_SESSION['token']; ?>">
        <div class="login-form-buttons">
          <?php if(!$this->has_public_login) echo '<a href="${ url }" class="button button-secondary login-cancel-button">Cancel</a>'; ?>
          <button type="submit" class="button login-button">Login</button>
        </div>
      </form>`;
      document.querySelector('.login-form').addEventListener('submit', (e) => {
        document.body.classList.add('form-loading');
        e.currentTarget.action = url;
        e.currentTarget.method = 'post';
      }, false);
    </script>
    </html><?php exit; // end form and exit
  }

  // get alert string for login form
  private function alert($text, $type = 'danger'){
    return '<div class="alert alert-' . $type . '" role="alert">' . $text . '</div>';
  }

  // outputs an alert in login form on logout, incorrect login or session ID mismatch
  private function get_form_alert(){

    // ?logout=1 show logout text if was logged in
    if(U::get('logout')) return isset($_SESSION['username']) ? $this->alert('You are now logged out', 'warning') : '';

    // must have been logged in, but session expired or username/password/IP/user-agent/app-location changed
    if(isset($_SESSION['username'])) return $this->alert('You were logged out', 'warning'); // probably shouldn't happen

    // failed login attempt, normally wrong username or password, although could be invalid login token
    if(isset($_POST['fusername'])) return $this->alert('Incorrect login', 'danger');

    // no alert in form
    return '';
  }
}

// class U / static utility functions (short U because I want compact function access)
class U {

  // get file basename / basically just a wrapper in case it needs to be refined on some servers
  public static function basename($path){
    return basename($path); // because setlocale(LC_ALL,'en_US.UTF-8')
    // OPTIONAL: replace basename() which may fail on UTF-8 chars if locale != UTF8
    //$arr = explode('/', str_replace('\\', '/', $path));
    //return end($arr);
  }

  // get mime type for file
  public static function mime($path){
    if(function_exists('mime_content_type')) return mime_content_type($path);
    if(function_exists('finfo_file')) return finfo_file(finfo_open(FILEINFO_MIME_TYPE), $path);
    return false;
  }

  // get file extension with options to lowercase and include dot
  public static function extension($path, $lowercase = false, $dot = false) {
  	$ext = pathinfo($path, PATHINFO_EXTENSION);
  	if(!$ext) return '';
  	if($lowercase) $ext = strtolower($ext);
  	if($dot) $ext = '.' . $ext;
  	return $ext;
  }

  // glob() wrapper for reading paths / escape [brackets] in folder names (it's complicated)
  public static function glob($path, $dirs_only = false){
    if(preg_match('/\[.+]/', $path)) $path = str_replace(['[',']', '\[', '\]'], ['\[','\]', '[[]', '[]]'], $path);
    return @glob($path, $dirs_only ? GLOB_NOSORT|GLOB_ONLYDIR : GLOB_NOSORT);
  }

  // get $_POST parameter or false
  public static function post($param){
  	return isset($_POST[$param]) && !empty($_POST[$param]) ? $_POST[$param] : false;
  }

  // get $_GET parameter or false
  public static function get($param){
  	return isset($_GET[$param]) && !empty($_GET[$param]) ? $_GET[$param] : false;
  }

  // make dir unless it already exists, error if fail
  public static function mkdir($path){
    if(!file_exists($path) && !mkdir($path, 0777, true)) U::error('Failed to create ' . $path, 500);
  }

  // helper function to check for and include various files html, php, css and js from storage_path _files/*
  public static function uinclude($file){
    if(!Config::$storagepath) return;
    $path = Config::$storagepath . '/' . $file;
    if(!file_exists($path)) return;
    $ext = U::extension($path);
    if(in_array($ext, ['html', 'php'])) return include $path;
    $src = Path::urlpath($path); // get urlpath for public resource
    if(!$src) return; // return if storagepath is non-public (not inside document root)
    $src .= '?' . filemtime($path); // append modified time of file, so updated resources don't get cached in browser
    if($ext === 'js') echo '<script src="' . $src . '"></script>';
    if($ext === 'css') echo '<link href="' . $src . '" rel="stylesheet">';
  }

  // attempt to ini_get($directive)
  public static function ini_get($directive){
    $val = function_exists('ini_get') ? @ini_get($directive) : false;
    return is_string($val) ? trim($val) : $val;
  }

  // get php ini value to bytes
  public static function ini_value_to_bytes($directive) {
    $val = U::ini_get($directive);
    if(empty($val) || !is_string($val)) return 0;
    if(function_exists('ini_parse_quantity')) return @ini_parse_quantity($val) ?: 0;
  	if(!preg_match('/^(\d+)([G|M|K])?$/i', trim($val), $m)) return 0;
  	if(!isset($m[2])) return (int) $m[1];
  	return (int) $m[1] *= ['G' => 1024 * 1024 * 1024, 'M' => 1024 * 1024, 'K' => 1024][strtoupper($m[2])];
  }

  // get memory limit in MB, if available, so we can calculate memory for image resize operations
  public static function get_memory_limit_mb() {
    $val = U::ini_value_to_bytes('memory_limit');
    return $val ? $val / 1024 / 1024 : 0; // convert bytes to M
  }

  // get exec app path (ffmpeg, imagemagick)
  private static function exec_app_path($app_path){

    // external thumbnail apps required load_images and image_resize_cache to be enabled
    foreach (['load_images', 'image_resize_cache'] as $key) if(!Config::get($key)) return;

    // exec() must be available to access command-line tools
    if(!function_exists('exec')) return;

    // path to ffmpeg in command-line is normally just 'ffmpeg', but escapeshellarg() in case using absolute path
    $path = escapeshellarg(Config::get($app_path));
    //$path = '"' . str_replace('"', '\"', Config::get($app_path)) . '"'; // <- if path contains Chinese chars

    // attempt to run -version function on app and return the path or false on fail
    return @exec($path . ' -version') ? $path : false;
  }

  // detect FFmpeg availability for video thumbnails and return path or false / https://ffmpeg.org/
  public static function ffmpeg_path(){

    // below config options must be enabled for FFmpeg to apply
    foreach (['video_thumbs', 'video_ffmpeg_path'] as $key) if(!Config::get($key)) return;

    // return imagemagick path for exec()
    return U::exec_app_path('video_ffmpeg_path');
  }

  // detect ImageMagick availability for PDF thumbnails and return path or false / https://imagemagick.org/
  public static function imagemagick_path(){

    // below config options must be enabled for FFmpeg to apply
    foreach (['pdf_thumbs', 'imagemagick_path'] as $key) if(!Config::get($key)) return;

    // return imagemagick path for exec()
    return U::exec_app_path('imagemagick_path');
  }

  // readfile() wrapper function to output file with tests, clone option and headers
  public static function readfile($path, $mime, $message = false, $cache = false, $clone = false){
    if(!$path || !file_exists($path)) return false;
    if($clone && @copy($path, $clone)) U::message('cloned to ' . U::basename($clone));
    U::header($message, $cache, $mime, filesize($path), 'inline', U::basename($path));
    if(!is_readable($path) || readfile($path) === false) U::error('Failed to read file ' . U::basename($path), 400);
    exit;
  }

  // return an array of supported image resize types / used by Javascript to determine what resized image types can be requested
  public static function resize_image_types(){
    return array_merge(['jpeg', 'jpg', 'png', 'gif'], array_filter(['webp', 'bmp', 'avif'], function($type){
      return function_exists('imagecreatefrom' . $type);
    }));
  }

  // common error response with response code, error message and json option
  // 400 Bad Request, 403 Forbidden, 401 Unauthorized, 404 Not Found, 500 Internal Server Error
  public static function error($error = 'Error', $http_response_code = false, $is_json = false){
    if($is_json) return Json::error($error);
    if($http_response_code) http_response_code($http_response_code);
    U::header("[ERROR] $error", false);
  	exit("<h3>Error</h3>$error.");
  }

  // get dirs hash based on various options for cache paths and browser localstorage / with cached response
  private static $dirs_hash;
  public static function dirs_hash(){
    if(self::$dirs_hash) return self::$dirs_hash;
    return self::$dirs_hash = substr(md5(Config::$document_root . Config::$__dir__ . Config::$root . Config::$version .  Config::get('cache_key') . U::image_resize_cache_direct() . Config::get('files_exclude') . Config::get('dirs_exclude')), 0, 6);
  }

  // check if image_resize_cache_direct is enabled for direct access to resized image cache files / with cached response
  private static $image_resize_cache_direct;
  public static function image_resize_cache_direct(){
    if(isset(self::$image_resize_cache_direct)) return self::$image_resize_cache_direct;
    return self::$image_resize_cache_direct = Config::get('image_resize_cache_direct') && !Config::$is_logged_in && Config::get('load_images') && Config::get('image_resize_cache') && Config::get('image_resize_enabled') && Path::is_within_docroot(Config::$storagepath);
  }

  // image_resize_dimensions_retina (serve larger dimension resized images for HiDPI screens) with cached response
  private static $image_resize_dimensions_retina;
  public static function image_resize_dimensions_retina(){
    if(isset(self::$image_resize_dimensions_retina)) return self::$image_resize_dimensions_retina;
    $retina = intval(Config::get('image_resize_dimensions_retina'));
    return self::$image_resize_dimensions_retina = $retina > Config::get('image_resize_dimensions') ? $retina : false;
  }

  // get common html header for main document and login page
  public static function html_header($title, $class){
  ?>
  <!doctype html><!-- www.files.gallery -->
  <html class="<?php echo $class; ?>" data-theme="contrast">
    <script>
    let theme = (() => {
      try {
        return localStorage.getItem('files:theme');
      } catch (e) {
        return false;
      };
    })() || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'contrast');
    if(theme !== 'contrast') document.documentElement.dataset.theme = theme;
    </script>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="robots" content="noindex, nofollow">
      <link rel="apple-touch-icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADABAMAAACg8nE0AAAAD1BMVEUui1f///9jqYHr9O+fyrIM/O8AAAABIklEQVR42u3awRGCQBBE0ZY1ABUCADQAoEwAzT8nz1CyLLszB6p+B8CrZuDWujtHAAAAAAAAAAAAAAAAAACOQPPp/2Y0AiZtJNgAjTYzmgDtNhAsgEkyrqDkApkVlsBDsq6wBIY4EIqBVuYVFkC98/ycCkr8CbIr6MCNsyosgJvsKxwFQhEw7APqY3mN5cBOnt6AZm/g6g2o8wYqb2B1BQcgeANXb0DuwOwNdKcHLgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeA20mArmB6Ugg0NsCcP/9JS8GAKSlVZMBk8p1GRgM2R4jMHu51a/2G1ju7wfoNrYHyCtUY3zpOthc4MgdNy3N/0PruC/JlVAwAAAAAAAAAAAAAAABwZuAHuVX4tWbMpKYAAAAASUVORK5CYII=">
      <meta name="mobile-web-app-capable" content="yes">
      <title><?php echo $title; ?></title>
      <?php U::uinclude('include/head.html'); ?>
      <link href="<?php echo U::assetspath(); ?>files.photo.gallery@<?php echo Config::$version ?>/css/files.css" rel="stylesheet">
      <?php U::uinclude('css/custom.css'); ?>
    </head>
  <?php
  }

  // output file as download using correct headers and readfile() / used to download zip and force download single files
  public static function download($file, $message, $mime, $filename){
    U::header($message, false, $mime, filesize($file), 'attachment', $filename);
    while (ob_get_level()) ob_end_clean();
    return readfile($file) !== false;
  }

  // assign assets url for plugins, Javascript, CSS and languages, defaults to CDN https://www.jsdelivr.com/
  // if you want to self-host assets: https://www.files.gallery/docs/self-hosted-assets/
  private static $assetspath;
  public static function assetspath(){
    if(self::$assetspath) return self::$assetspath;
    return self::$assetspath = Config::get('assets') ? rtrim(Config::get('assets'), '/') . '/' : 'https://cdn.jsdelivr.net/npm/';
  }

  // response headers

  // cache time 1 year for cacheable assets / can be modified if you really need to
  public static $cache_time = 31536000;

  // array of messages to go into files-response header
  private static $messages = [];

  // add messages (string or array) to files-response header
  public static function message($items = []){
    self::$messages = array_merge(self::$messages, is_string($items) ? [$items] : array_filter($items));
  }

  // set request response headers, including files-message header for diagnosing response
  public static function header($message, $cache = null, $type = false, $length = 0, $disposition = false, $filename = ''){

    // prepend main $message to $messages array
    if($message) array_unshift(self::$messages, $message);

    // append PHP response time to $messages
    if(isset($_SERVER['REQUEST_TIME_FLOAT'])) self::$messages[] = round(microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'], 3) . 's';

    // append memory usage to $messages
    if(function_exists('memory_get_peak_usage')) self::$messages[] = round(memory_get_peak_usage() / 1048576, 1) . 'M';

    // assign files-message header with all $messages
    header('files-response: ' . implode(' | ', self::$messages));

    // cache response headers
    if($cache){
      $shared = Config::$is_logged_in ? 'private' : 'public'; // private or shared cache depending on login
      header('expires: ' . gmdate('D, d M Y H:i:s \G\M\T', time() + self::$cache_time));
      header('cache-control: ' . $shared . ', max-age=' . self::$cache_time . ', s-maxage=' . self::$cache_time . ', immutable');

    // no cache response headers if specifically set to false (if null, don't do anything)
    } else if($cache === false){
      header('cache-control: no-store, must-revalidate');
    }

    // assign content-type header
    if($type) header("content-type: $type");

    // assign content-length header / only assigned when reading actual files on disk when we can get filesize()
    if($length) header("content-length: $length");

    // assign content-disposition when reading files on disk, assigned to either 'inline' or 'attachment'
    if($disposition) header('content-disposition: ' . $disposition . '; filename="' . addslashes($filename) . '"');
  }
}

// class Path / various static functions to convert and validate file paths
class Path {

  // returns resolved absolute paths and normalizes slashes across OS / returns false if file does not exist
  public static function realpath($path){
    $realpath = realpath($path);
    return $realpath ? str_replace('\\', '/', $realpath) : false;
  }

  // get absolute path by appending relative path to root path (does not resolve symlinks)
  public static function rootpath($relpath){
    return Config::$root . (strlen($relpath) ? "/$relpath" : ''); // check paths with strlen() in case dirname is '0'
  }

  // get relative path from full root path / used as internal reference and in query ?path/path
  public static function relpath($path){
    return trim(substr($path, strlen(Config::$root)), '\/');
  }

  // determines if root is accessible by URL and returns the root url path, which in turn allows files to be accessible by url
  private static function get_root_url_path(){

    // custom root url path if `root_url_path` is assigned
    if(is_string(Config::get('root_url_path'))) return Config::get('root_url_path');

    // if root is within application dir (index.php), we can serve application-relative path
    //if(self::is_within_path(Config::$root, Config::$__dir__)) return substr(Config::$root, strlen(Config::$__dir__) + 1);


    // if root is within application dir (index.php), we can serve application-relative path
    if(self::is_within_path(Config::$root, Config::$__dir__)) {

      // if root is same as app dir (quite common), return empty relative path ''
      if(Config::$root === Config::$__dir__) return '';

      // return relative path from app to root
      return substr(Config::$root, strlen(Config::$__dir__) + 1);
    }

    // if root is within document root, serve root-relative path
    if(self::is_within_docroot(Config::$root)) return substr(Config::$root, strlen(Config::$document_root));

    // exit unless root is a symlink
    // at this point, when `root` resolves outside of document root, we have to assume it's not directly accessible by url
    // if you know your `root` is accessible by url somehow (nginx/apache/symlink), you can use the `root_url_path` config option
    if(!is_link(Config::get('root'))) return false;

    // in case someone wants to entirely disable resolving url path from root symlinks that point outside of document root
    if(Config::get('root_url_path') === FALSE) return false;

    // SYMLINK helpers
    // because it's useful to point root to symlinks that might be in, but resolve outside document root

    // assign $root shortcut just to make things more readable
    $root = Config::get('root');

    // don't mess around with absolute paths that point to symlinks outside of document root, as it's pointless and complicated
    if(preg_match('/:\/|^\/|^\\\/', $root)) return false;

    // to create a base app or root relative path, we need to trim orders
    $trimmed_root = trim($root, './');

    // check if root traverses up into parent dirs somewhere, and count traversal depth
    $root_parent_depth = substr_count($root, '..');

    // if root does not traverse parent dirs, we can assume it's relative to app (index.php)
    // re-check if trimmed relative path exists and return app relative path
    if(!$root_parent_depth) return file_exists($trimmed_root) ? $trimmed_root : false;

    // attempt to assemble /root-relative path if root traverses up into parent dirs
    // must check PHP_SELF for comparison and PHP > 7
    if(!isset($_SERVER['PHP_SELF']) || version_compare(PHP_VERSION, '7.0.0') < 0) return false;

    // PHP_SELF determines application root url path, so we can check root parent compared to application path
    $php_self = $_SERVER['PHP_SELF'];

    // get relative url depth of self (-1 because includes trailing slash with filename /path/index.php)
    $php_self_depth = substr_count($php_self, '/') - 1;

    // exit if root parent depth extends beyond php self depth
    if($root_parent_depth > $php_self_depth) return false;

    // assemble root-relative url path by traversing php_self
    return rtrim(dirname($php_self, $root_parent_depth + 1), '/') . '/' . $trimmed_root;
  }

  // create url path for a file from $root_url_path + file relative path / used for dir data, get_downloadables and uploads
  private static $root_url_path;
  public static function rooturlpath($rel){

    // $root_url_path only needs to be assigned once when required
    if(!isset(self::$root_url_path)) self::$root_url_path = self::get_root_url_path();

    // return false if if $root_url_path is false
    if(self::$root_url_path === FALSE) return false; //return self::urlpath($path);

    // return $root_url_path if relative path is empty (would be the root dir)
    if(!$rel) return self::$root_url_path;

    // assemble url path for file from $root_url_path and $rel
    return self::$root_url_path . (in_array(self::$root_url_path, ['', '/']) ? '' : '/') . $rel;
  }

  // get public url path relative to script or server document root
  public static function urlpath($path){

    // return if item is not within server document root, because it can't be accessed by www url
    if(!self::is_within_docroot($path)) return false;

    // if item is within application dir, we can return relative path
    if(self::is_within_path($path, Config::$__dir__)) return $path === Config::$__dir__ ? '.' : substr($path, strlen(Config::$__dir__) + 1);

    // return root-relative path
    return $path === Config::$document_root ? '/' : substr($path, strlen(Config::$document_root));
  }

  // determines if a path is equal to or inside another path / append slash so that path/dirx/ does not match path/dir/
  public static function is_within_path($path, $root){
    return $path && strpos($path . '/', $root . '/') === 0;
  }

  // determines if path is within server document root (so we can determine if it's accessible by URL)
  public static function is_within_docroot($path){
    return $path && self::is_within_path($path, Config::$document_root);
  }

  // calculate path for image resize cache
  public static function imagecachepath($path, $image_resize_dimensions, $filesize, $filemtime){
    return Config::$cachepath . '/images/' . substr(md5($path), 0, 6) . ".$filesize.$filemtime.$image_resize_dimensions.jpg";
  }

  // determines if relative path is valid, and returns full rootpath or false if invalid
  public static function valid_rootpath($relpath, $is_dir = false){

    // invalid if path is false (might be previously unresolved)
    if($relpath === false) return;

    // invalid if is file and path is empty (path can be '' empty string for root dir)
    if(!$is_dir && empty($relpath)) return;

    // relative path should never start or end with slash/
    if(preg_match('/^\/|\/$/', $relpath)) return;

    // get root path from relative path
    $rootpath = self::rootpath($relpath);

    // realpath may differ from rootpath if symlinked or if relpath contains parent ../ paths
    $realpath = self::realpath($rootpath);

    // invalid if file does not exist
    if(!$realpath) return;

    // additional security checks if realpath differs from rootpath, and realpath is no longer within root
    // blocks potential abuse of relative paths like ?path/../../../../dir
    if($realpath !== $rootpath && !self::is_within_path($realpath, Config::$root)) {
      if(strpos(($is_dir ? $relpath : dirname($relpath)), ':') !== false) return; // dir may not contain ':'
      if(strpos($relpath, '..') !== false) return; // path may not contain '..'
      //if(self::is_exclude($realpath, $is_dir, true)) return; // check is_exclude also on realpath / seems pointless ...
    }

    // is invalid
    if(!is_readable($realpath)) return;        // not readable
    if($is_dir && !is_dir($realpath)) return;  // invalid dir
    if(!$is_dir && !is_file($realpath)) return;// invalid file
    if(self::is_exclude($rootpath, $is_dir)) return; // rootpath is excluded

    // return full path
    return $rootpath;
  }

  // determine if path should be excluded from displaying in the gallery
  public static function is_exclude($path = false, $is_dir = true, $symlinked = false){

    // is not excluded if empty or path is root
    if(!$path || $path === Config::$root) return;

    // exclude relative paths that start with _files* (reserved for hidden items)
    if(strpos('/' . self::relpath($path), '/_files') !== false) return true;

    // exclude Files Gallery PHP application name (normally "index.php" but could be renamed)
    if($path === Config::$__file__) return true;

    // exclude symlinks if symlinks not allowed (symlinks might be sensitive)
    if($symlinked && !Config::get('allow_symlinks')) return true;

    // exclude Files Gallery storage_path (normally _files dir relative to PHP file)
    if(Config::$storagepath && self::is_within_path($path, Config::$storagepath)) return true;

    // exclude if dir or file's parent dir is excluded by config dirs_exclude
    if(Config::get('dirs_exclude')) {

      // dir to check is path or parent dir if file
      $dirname = $is_dir ? $path : dirname($path);

      // check if dir matches dirs_exclude, unless dir is root (root dir can't be excluded)
      if($dirname !== Config::$root && preg_match(Config::get('dirs_exclude'), self::relpath($dirname))) return true;
    }

    // exclude file
    if(!$is_dir){

      // get file name
      $filename = U::basename($path);

      // make sure file is not local config file
      if($filename === Config::$localconfigpath) return true;

      // exclude file name (not path) by files_exclude
      if(Config::get('files_exclude') && preg_match(Config::get('files_exclude'), $filename)) return true;
    }
  }
}

// class Json / JSON response functions
class Json {

  // output json from array and exit
  public static function jexit($arr = []){
    header('content-type: application/json');
    exit(json_encode($arr));
  }

  // json error with message
  public static function error($error = 'Error'){
    self::jexit(['error' => $error]);
  }

  // output json from array and cache as .json / used by class dirs and class dir
  public static function cache($arr = [], $message = false, $cache = true){
    $json = empty($arr) ? '{}' : @json_encode($arr, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_PARTIAL_OUTPUT_ON_ERROR);
    if(empty($json)) self::error(json_last_error() ? json_last_error_msg() : 'json_encode() error');
  	if($cache) @file_put_contents($cache, $json);
    U::message(['cache ' . ($cache ? 'ON' : 'OFF') ]);
    U::header($message, false, 'application/json;');
  	echo $json;
  }
}

// class X3 / functions if running Files Gallery alongside X3 www.photo.gallery
class X3 {

  // vars
  private static $path; // cache absolute X3 path
  private static $inc = '/app/x3.inc.php'; // relative path to the X3 include file that is used for checking and invalidating cache

  // checks if Files Gallery root points into X3 content and returns path to X3 root
  public static function path(){
    if(isset(self::$path)) return self::$path; // serve previously resolved path
    // loop resolved path and original config path, in case resolved path was symlinked
    foreach ([Config::$root, Config::get('root')] as $path) {
      // match /content and check if /app/x3.inc.php exists in parent
      if($path && preg_match('/(.+)\/content/', $path, $match) && file_exists($match[1] . self::$inc)) return self::$path = Path::realpath($match[1]);
    }
    // no match found
    return self::$path = false;
  }

  // attempt to load x3-login if 1. root is X3 path, 2. there is no existing login, 3. files.x3-login.php exists
  public static function login(){
    return self::path() && U::uinclude('plugins/files.x3-login.php');
  }

  // get public url path of X3, used to render X3 thumbnails instead of thumbs created by Files Gallery
  public static function x3_path(){
    return self::path() ? Path::urlpath(self::path()) : false;
  }

  // on Filemanager actions, invalidate X3 cache updating modified time of x3.inc.php
  public static function invalidate(){
    if(self::path()) @touch(self::path() . self::$inc);
  }
}

// class Tests / outputs PHP, server and config diagnostics by url ?action=tests
class Tests {

  // html response
  private $html = '';

  // construct new Tests()
  function __construct() {

    // display all errors to catch anything unusual
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    // first let's check if new Config() created dirs and files in storagepath
    $this->created();

    // title, version, server name, PHP version and server software
    $this->html .= '<h2>Files Gallery ' . Config::$version . '</h2>';
    if(isset($_SERVER['SERVER_NAME'])) $this->prop('<b>'.$_SERVER['SERVER_NAME'].'</b>');
    $this->prop('<b>PHP ' . phpversion().'</b>');
    if(isset($_SERVER['SERVER_SOFTWARE'])) $this->prop('<b>'.$_SERVER['SERVER_SOFTWARE'].'</b>');

    // check if paths root, storage_path and index.php exist and are writeable
    $this->check_path(Config::$root, 'root');
    $this->check_path(Config::$storagepath, 'storage_path');
    $this->check_path(__FILE__, U::basename(__FILE__));

    // check a few PHP extensions gd, exif and mbstring
    if(function_exists('extension_loaded')) foreach (['gd', 'exif', 'mbstring'] as $name) $this->prop($name, extension_loaded($name));

    // check if ZipArchive class exists
    $this->prop('ZipArchive', class_exists('ZipArchive'));

    // check various PHP functions
    foreach (['mime_content_type', 'finfo_file', 'iptcparse', 'exif_imagetype', 'session_start', 'ini_get', 'exec'] as $name) $this->prop($name . '()', function_exists($name));

    // check ffmpeg if exec() is available
    if(function_exists('exec')) $this->prop('ffmpeg', !!U::ffmpeg_path());

    // check imagemagick if exec() is available
    if(function_exists('exec')) $this->prop('imagemagick', !!U::imagemagick_path());

    // get various PHP ini values with ini_get()
    if(function_exists('ini_get')) foreach (['memory_limit', 'file_uploads', 'upload_max_filesize', 'post_max_size', 'max_file_uploads'] as $name) $this->prop($name, 'neutral', @ini_get($name));

    // validate regex for files_exclude and dirs_exclude config options
    foreach (['files_exclude', 'dirs_exclude'] as $key) if(Config::get($key) && @preg_match(Config::get($key), '') === false) $this->prop("Invalid <strong>$key</strong> regex", false);

    // output merged config in readable format, with sensitive properties masked out
    $this->showconfig();

    // output basic formatted tests in html format
    $this->output();

    // exit on tests output
    exit;
  }

  // checks if new Config() created dirs and files in storagepath
  // useful to run ?action=tests if you want to create config.php file before executing Files Gallery
  private function created(){
    if(empty(Config::$created)) return;
    $this->html .= '<p>Successfully created the following storage items:</p>';
    foreach (Config::$created as $key) $this->prop($key, true);
  }

  // checks if a path exists and is writeable
  private function check_path($path, $name){
    if(!$path) return $this->prop($name, false);
    if(!file_exists($path)) return $this->prop("$name does not exist", false);
    if(!is_writable($path)) return $this->prop($name . ' is not writeable ' . substr(sprintf('%o', fileperms($path)), -4) . ' [owner ' . fileowner($path) . ']', false);
    $this->prop($name, true);
  }

  // outputs and formats a property feature <div> element to html
  private function prop($name, $success = 'neutral', $value = ''){
    $class = is_string($success) ? $success : ($success ? ' success' : 'fail');
    $this->html .= "<div class=\"test $class\">$name <b>$value</b></div>";
  }

  // output merged config in readable format, with sensitive properties masked out
  private function showconfig(){

    // copy config array
    $arr = Config::$config;

    // mask sensitive values
    foreach (['root', 'storage_path', 'start_path', 'username', 'password', 'license_key', 'allow_tasks'] as $prop) if($arr[$prop]) $arr[$prop] = '***';

    // create PHP array string that resembles config.php files
    $php = '<?php' . PHP_EOL . PHP_EOL . 'return ' . var_export($arr, true) . ';';

    // add to html response and highlight
    $this->html .= '<h2>Config</h2>' . highlight_string($php, true);
  }

  // output basic formatted tests in html format
  private function output(){
    echo '<!doctype html><html><head><title>Files Gallery check system and config.</title><meta name="robots" content="noindex,nofollow"><style>body{font-family:system-ui;color:#444;line-height:1.6;margin:2vw 3vw;overflow:scroll}b{font-weight:600}.test:before{display:inline-block;width:18px;text-align:center;margin-right:5px}.neutral:before{color:#BBB}.success:before{color:#78a642}.success:before,.neutral:before{content:"\2713"}.fail:before{content:"\2A09";color:firebrick}</style></head><body>' . $this->html . '</body></html>';
  }
}

// class FileResponse / outputs file, video preview image, resized image or proxies any file by PHP
class FileResponse {

  // vars
  private $path;
  private $mime;
  private $resize;
  private $clone;
  // static vars
  //private static $preview_cmd_video = '%APP_PATH% -ss 3 -t 1 -hide_banner -i "%PATH%" -frames:v 1 -an -vf "thumbnail,scale=480:320:force_original_aspect_ratio=increase,crop=480:320" -r 1 -y -f mjpeg "%CACHE%" 2>&1';
  private static $preview_cmd_video = '%APP_PATH% -ss 3 -t 1 -hide_banner -i "%PATH%" -frames:v 1 -an -vf "thumbnail,scale=min\'(480,iw)\':min\'(480,ih)\':force_original_aspect_ratio=decrease" -r 1 -y -f mjpeg "%CACHE%" 2>&1';
  private static $preview_cmd_pdf = '%APP_PATH% "%PATH%[0]" -background white -flatten -quality 80 -thumbnail 480x480 "%CACHE%" 2>&1';

  // construct FileResponse all processes in due order
  public function __construct($path, $resize = false, $clone = false){

    // exif if invalid $path
    if(!$path) U::error('Invalid file request', 404);

    // store path and resolve potential symlinks
    $this->path = Path::realpath($path);

    // get mime to check if requested video or image files are valid
    $this->mime = U::mime($this->path);

    // resize numeric value assigned if image resize, but could be set to 'video'
    $this->resize = is_numeric($resize) ? intval($resize) : $resize;

    // clone the file (used by folder preview action)
    $this->clone = $clone;

    // get preview from exec() for video/FFmpeg and pdf/Imagemagick
    if(in_array($this->resize, ['video', 'pdf'])) return $this->get_exec_preview($this->resize);

    // get resized image preview (convert resize parameter to number, else it will return 0, not allowed)
    if($this->resize) return $this->get_image_preview();

    // get file proxied through PHP if it's not within document root
    $this->get_file_proxied();
  }

  // get preview from exec() for video/FFmpeg and pdf/Imagemagick
  private function get_exec_preview($type){

    // image_resize_cache required for exec previews, because we need to create the file on disk anyway
    if(!Config::get('image_resize_cache')) U::error("image_resize_cache must be enabled to create and store $type previews", 400);

    // requirements / only check $mime if $mime detected
    if($this->mime && strpos($this->mime, $this->resize) === false) U::error("Unsupported $type type $this->mime", 415);

    // get FFmpeg path `video_ffmpeg_path` or error
    if($type === 'video'){
      $app_path = U::ffmpeg_path() ?: U::error('Video thumbnails disabled, check your <a href="' . U::basename(__FILE__) . '?action=tests" target="_blank">diagnostics</a>', 400);

    // get ImageMagick path `imagemagick_path` or error
    } else {
      $app_path = U::imagemagick_path() ?: U::error('PDF thumbnails disabled, check your <a href="' . U::basename(__FILE__) . '?action=tests" target="_blank">diagnostics</a>', 400);
    }

    // get cache path, where we will look for image or create it
    $cache = Path::imagecachepath($this->path, 480, filesize($this->path), filemtime($this->path));

    // check for cached preview / clone if called from folder preview
    if($cache) U::readfile($cache, 'image/jpeg', "$type preview from cache", true, $this->clone);

    // get exec command string
    $cmd = str_replace(
      ['%APP_PATH%', '%PATH%', '%CACHE%'],
      [$app_path, str_replace('"', '\"', $this->path), $cache],
      self::${"preview_cmd_$type"});

    // attempt to execute exec command
    exec($cmd, $output, $result_code);

    // fail if result_code is anything else than 0
    if($result_code) U::error("Error generating $type preview image (\$result_code $result_code)", 500);

    // if for some reason, the created $cache file does not exist
    if(!file_exists($cache)) U::error('Cache file ' . U::basename($cache) . ' does not exist', 404);

    // fix for empty preview images (f.ex extremely short videos or other unknown errors)
    if(!filesize($cache) && imagejpeg(imagecreate(1, 1), $cache)) U::readfile($cache, 'image/jpeg', '1px placeholder image created and cached', true, $this->clone);

    // output created video thumbnail
    U::readfile($cache, 'image/jpeg', "$type preview created", true, $this->clone);
  }

  // check if requested resize value is allowed
  private function resize_allowed(){
    if(empty($this->resize) || !is_numeric($this->resize)) return false;
    if($this->resize === Config::get('image_resize_dimensions')) return true;
    if($this->resize === Config::get('image_resize_dimensions_retina')) return true;
    // check image_resize_dimensions_allowed array
    $allowed = Config::get('image_resize_dimensions_allowed') ?: [];
    return in_array($this->resize, array_filter(array_map('intval', is_array($allowed) ? $allowed : explode(',', $allowed))));
  }

  // get image preview resized image
  private function get_image_preview(){

    // only image mime types can be resized
    if($this->mime && strtok($this->mime, '/') !== 'image') U::error('Unsupported image type ' . $this->mime, 415);

    // allow resize image only if config load_images and image_resize_enabled are enabled
    foreach (['load_images', 'image_resize_enabled'] as $key) if(!Config::get($key)) U::error("Config $key disabled", 400);

    // check if requested resize value is allowed
    if(!$this->resize_allowed()) U::error("Resize parameter $this->resize is not allowed", 400);

    // get ResizeImage()
    new ResizeImage($this->path, $this->resize, $this->clone);
  }

  // get file proxied through PHP if it's not within document root
  private function get_file_proxied(){

    // don't allow getting file by proxy if !load_files_proxy_php and the file is available in document root
    if(!Config::get('load_files_proxy_php') && Path::is_within_docroot($this->path)) U::error('File can\'t be proxied', 400);

    // read file / $mime or 'application/octet-stream' if $mime is unknown (should not happen unless missing functions)
    U::readfile($this->path, ($this->mime ?: 'application/octet-stream'), 'File proxied', true);
  }
}

// class ResizeImage / serves a resized image
class ResizeImage {

  // set a different fill color than black (default) for images with transparency / disabled by default []
  // only enable when strictly required, as it will assign fill color also for non-transparent images
  public static $fill_color = []; // white [255, 255, 255];

  // class properties
  private $path;        // full path to image
  private $rwidth;      // calculated resize width
  private $rheight;     // calculated resize height
  private $pixels;      // used to check if pixels > max_pixels and to calculate required memory
  private $bits;        // extracted from getimagesize() for use in set_memory_limit()
  private $channels;    // extracted from getimagesize() for use in set_memory_limit()
  private $dst_image;   // destination image GD resource with resize dimensions, also used in sharpen() and exif_orientation()

  // construct resize image, all processes in due order
  public function __construct($path, $resize, $clone = false){

    // vars
    $this->path = $path;
    $filesize = filesize($this->path);

    // create local $short vars from config 'image_resize_*' options, because it's much easier and more readable
    foreach (['cache', 'types', 'quality', 'function', 'sharpen', 'memory_limit', 'max_pixels', 'min_ratio'] as $key) {
      $$key = Config::get("image_resize_$key");
    }

    // add to response headers
    U::message(['cache ' . ($cache ? 'ON' : 'OFF'), "resize $resize", "quality $quality", $function]);

    // get cache path for image (or null for imagejpeg())
    $cache_path = $cache ? Path::imagecachepath($this->path, $resize, $filesize, filemtime($this->path)) : null;

    // attempt to load $cache_path / will simply fail if $cache_path does not exist
    if($cache_path) U::readfile($cache_path, 'image/jpeg', 'Resized image from cache', true, $clone);

    // getimagesize / original dimensions, image type, bits, channels and mime
    $imagesize = getimagesize($this->path);
    if(empty($imagesize) || !is_array($imagesize)) U::error('Failed getimagesize()', 500); // die!

    // vars extrapolated from $imagesize
    $width = (int) $imagesize[0]; // (int) because AVIF might return '0x0'
    $height = (int) $imagesize[1]; // (int) because AVIF might return '0x0'
    $ratio = max($width, $height) / $resize; // calculate resize ratio from image longest side (width or height)
    $this->rwidth = round($width / $ratio); // calculate resize width
    $this->rheight = round($height / $ratio); // calculate resize height
    $this->pixels = $width * $height; // used to check if pixels > max_pixels and to calculate required memory
    $type = $imagesize[2]; // returns one of the IMAGETYPE_XXX constants indicating the type of the image.
    $mime = isset($imagesize['mime']) && is_string($imagesize['mime']) ? $imagesize['mime'] : false;
    $this->bits = isset($imagesize['bits']) && is_numeric($imagesize['bits']) ? $imagesize['bits'] : 8;
    $this->channels = isset($imagesize['channels']) && is_numeric($imagesize['channels']) ? $imagesize['channels'] : 3;

    // get image type extension or die / used to check if $ext is in `image_resize_types` and for "imagecreatefrom$ext"() function
    $ext = image_type_to_extension($type, false) ?: U::error("Invalid image type $type");

    // add more calculated values to response headers
    U::message([$mime, $ext, "$width x $height", 'ratio ' . round($ratio, 2), "$this->rwidth x $this->rheight"]);

    // if image extension is not in `image_resize_types`, attempt to serve original if filesize is <= `load_images_max_filesize`
    if(!in_array($ext, $this->get_resize_types($types))){

      // exit if original image exceeds `load_images_max_filesize`
      if($filesize > Config::get('load_images_max_filesize')) U::error("Image $ext is not in `image_resize_types`, and can't serve original because filesize $filesize exceeds `load_images_max_filesize` " . Config::get('load_images_max_filesize') . ' bytes', 400);

      // attempt to serve original or error
      if(!U::readfile($this->path, $mime, 'Original image served because image is not within image_resize_types', true, $clone)) U::error('File does not exist', 404);
    }

    // exit if image pixels (dimensions) exceeds 'image_resize_max_pixels' => 60000000 (default)
    if($max_pixels && $this->pixels > $max_pixels) U::error("Image pixels $this->pixels ($width x $height) exceeds `image_resize_max_pixels` $max_pixels", 400);

    // serve original if resize ratio < min_ratio, but only if filesize <= load_images_max_filesize
    if($ratio < max($min_ratio, 1) && $filesize <= Config::get('load_images_max_filesize') && !U::readfile($this->path, $mime, "Original image served, because resize ratio $ratio < min_ratio $min_ratio", true, $clone)) U::error('File does not exist', 404);

    // prepare imagecreatefrom$EXT() to create image GD resource from path
    $imagecreatefrom = "imagecreatefrom$ext";
    if(!function_exists($imagecreatefrom)) U::error("Function $imagecreatefrom() does not exist", 500);

    // check if avaialble memory is sufficient to resize image, and attempt to temporarily assign higher memory_limit
    $this->set_memory_limit($memory_limit);

    // create new source image GD resource from path
    $src_image = $imagecreatefrom($this->path) ?: U::error("Function $imagecreatefrom() failed", 500);

    // create destination image GD resource with resize dimensions
    $this->dst_image = imagecreatetruecolor($this->rwidth, $this->rheight) ?: U::error('Function imagecreatetruecolor() failed', 500);

    // set a different fill color than black (default) for images with transparency / disabled by default $fill_color = []
    $this->set_fill_color($ext);

    // imagecopyresampled() src_image to dst_image
    if(!call_user_func($function, $this->dst_image, $src_image, 0, 0, 0, 0, $this->rwidth, $this->rheight, $width, $height)) U::error("Function $function() failed", 500);

    // destroy src_image GD resource to free up memory
    imagedestroy($src_image);

    // rotate resized image according to exif image orientation if required
    $this->exif_orientation();

    // sharpen resized images, because default PHP imagecopyresized() make images blurry ...
    if($sharpen) $this->sharpen();

    // add headers for direct output if !cache / missing content-length but that's ok
    if(!$cache_path) U::header('Resized image served', true, 'image/jpeg');

    // create jpg image in cache path or output directly if !cache
    if(!imagejpeg($this->dst_image, $cache_path, $quality)) U::error('PHP imagejpeg() failed', 500);

    // destroy dst_image resource to free up memory
    imagedestroy($this->dst_image);

    // cache readfile
    if($cache_path && !U::readfile($cache_path, 'image/jpeg', 'Resized image served', true, $clone)) U::error('Cache file does not exist', 404);

    // always exit
    exit;
  }

  // check if avaialble memory is sufficient to resize image, and attempt to temporarily assign new memory_limit
  private function set_memory_limit($memory_limit){
    // config image_resize_memory_limit must be assigned
    if(empty($memory_limit)) return;
    // get memory_limit in MB
    $current = U::get_memory_limit_mb();
    // pointless to make any assumptions if we can't get default memory_limit, just try to resize ...
    if(empty($current)) return;
    // calculate approximate required memory to resize image
    $required = round(($this->pixels * $this->bits / 8 * $this->channels * 1.33 + $this->rwidth * $this->rheight * 4) / 1048576, 1);
    // get new memory_limit, assigned from config image_resize_memory_limit, if higher than $current
    $new = function_exists('ini_set') ? max($current, $memory_limit) : $current;
    // error if required memory > available memory
    if($required > $new) U::error("Resizing this image requires >= {$required}M. Your PHP memory_limit is {$new}M", 400);
    // assign $new memory from config image_resize_memory_limit if > $current (default memory_limit)
    if($new > $current && @ini_set('memory_limit', $new . 'M')) U::message("{$current}M => {$new}M (min {$required}M)");
  }

  // get resize types array from config 'image_resize_types' => 'jpeg, png, gif, webp, bmp, avif'
  private function get_resize_types($types){
    return array_filter(array_map(function($key){
      $type = trim(strtolower($key));
      return $type === 'jpg' ? 'jpeg' : $type;
    }, explode(',', $types)));
  }

  // sharpen resized images, because default PHP imagecopyresized() make images blurry ...
  private function sharpen(){
    $matrix = [
      [-1, -1, -1],
      [-1, 20, -1],
      [-1, -1, -1],
    ];
    $divisor = array_sum(array_map('array_sum', $matrix));
    $offset = 0;
    imageconvolution($this->dst_image, $matrix, $divisor, $offset);
  }

  // rotate resized image according to exif image orientation (no way we deal with this in browser)
  private function exif_orientation(){
    // attempt to get image exif array
    $exif = Exif::exif_data($this->path);
    // exit if there is no exif orientation value
    if(!$exif || !isset($exif['Orientation'])) return;
    // assign $orientation
    $orientation = $exif['Orientation'];
    // array of orientation values to rotate (4, 5 and 7  will also be flipped)
    $orientation_to_rotation = [3 => 180, 4 => 180, 5 => 270, 6 => 270, 7 => 90, 8 => 90];
    // return if orientation is not valid or is not in array (does not require rotation)
    if(!array_key_exists($orientation, $orientation_to_rotation)) return;
    // rotate image according to exif $orientation, write back to already-resized image destination resource
    $this->dst_image = imagerotate($this->dst_image, $orientation_to_rotation[$orientation], 0);
    // after rotation, orientation values 4, 5 and 7 also need to be flipped in place
    if(in_array($orientation, [4, 5, 7]) && function_exists('imageflip')) imageflip($this->dst_image, IMG_FLIP_HORIZONTAL);
    // add header props
    U::message("orientated from EXIF $orientation");
  }

  // sets a different fill color than black (default) for images with transparency / disabled by default
  private function set_fill_color($ext){
    if(!is_array(self::$fill_color) || count(self::$fill_color) !== 3 || !in_array($ext, ['png', 'gif', 'webp', 'avif'])) return;
    $color = call_user_func_array('imagecolorallocate', array_merge([$this->dst_image], self::$fill_color));
    if(imagefill($this->dst_image, 0, 0, $color)) U::message('Fill rgb(' . join(', ', self::$fill_color) . ')');
  }
}

// class Dirs / outputs menu json from dir structure
class Dirs {

  // vars
  private $dirs = []; // array of dirs to output when re-creating
  private $cache_file = false; // cache file path / gets assigned to a path if cache is enabled
  private $load_files = false; // load files into each menu dir if Config::get('menu_load_all')

  // construct Dirs
  public function __construct(){

    // first check and assign cache / returns cache json if valid
    $this->check_cache();

    // load files in each dir if config menu_load_all
    $this->load_files = Config::get('menu_load_all');

    // if not cached, get dirs starting from root dir
    $this->get_dirs(Config::$root);

    // outputs dirs json format and cache
    Json::cache($this->dirs, 'Dirs reloaded', $this->cache_file);
  }

  // check cache for menu and return if valid
  private function check_cache(){

    // exit if cache disabled
    if(!Config::get('cache')) return;

    // get cache hash from POST menu_cache_hash so we can assign correct cache file
    $hash = U::post('menu_cache_hash');

    // validate $hash to make sure we check and create correct cache file names (not strictly necessary, but just in case)
    if(!$hash || !preg_match('/^.{6}\..{6}\..\d+$/', $hash)) Json::error('Invalid menu cache hash');

    // assign cache file when cache is enabled / check if file exists, or write to this file when re-creating
    $this->cache_file = Config::$cachepath . "/menu/$hash.json";

    // return if cache file does not exist
    if(!file_exists($this->cache_file)) return;

    // get json from cache file
    $json = @file_get_contents($this->cache_file);

    // return if the file is empty (for some reason)
    if(empty($json)) return;

    // check if menu cache is valid by comparing folder modified dates
    if(!$this->menu_cache_is_valid($json)) return;

    // assign headers
    U::header('Valid menu cache', null, 'application/json');

    // if browser has valid menu cache stored, just confirm cache is valid // don't use Json::exit, because we already set header
    if(U::post('localstorage')) exit(json_encode(['localstorage' => true]));

    // output json cache file
    exit($json);
  }

  // check if json menu cache is valid by comparing folder dates (modified time)
  private function menu_cache_is_valid($json){
    if(!Config::get('menu_cache_validate')) return true; // don't validate deep levels beyond 2
    $arr = @json_decode($json, true); // create array to compare times
    if(empty($arr)) return;
    // loop dirs and compare modified-time to check if cache is valid / skip shallow 1st level dirs
    foreach ($arr as $val) {
      if(strpos($val['path'], '/') !== false && $val['mtime'] !== @filemtime(Path::rootpath($val['path']))) return;
    }
    return $json; // it's valid, because json folder dates match real folder dates
  }

  // get_dirs recursive directories
  private function get_dirs($path, $depth = 0) {

    // load data for dir / ignore depth 0 (root), because it's already loaded, unless load_files
    if($depth || $this->load_files) {

      // return if dir is excluded
      if(Path::is_exclude($path, true)) return;

      // get array of data for dir, including files load_files (config menu_load_all)
      $data = (new Dir($path))->load($this->load_files);

      // exit if empty / should not happen, but just on case
      if(empty($data)) return;

      // assign dir $data to array of $dirs
      $this->dirs[] = $data;

      // exit if current depth >= config menu_max_depth (don't get subdirs)
      if(Config::get('menu_max_depth') && $depth >= Config::get('menu_max_depth')) return;

      // exit if item is symlink and don't follow symlinks (don't get subdirs)
      if($data['is_link'] && !Config::get('menu_recursive_symlinks')) return;// $arr;
    }

    // get subdirs from current path
    $subdirs = U::glob("$path/*", true);

    // sort subdirs and get data for each dir (including further subdirs)
    if(!empty($subdirs)) foreach($this->sort($subdirs) as $subdir) $this->get_dirs($subdir, $depth + 1);
  }

  // sort subfolders
  private function sort($dirs){
    if(strpos(Config::get('menu_sort'), 'date') === 0){
      usort($dirs, function($a, $b) {
        return filemtime($a) - filemtime($b);
      });
    } else {
      natcasesort($dirs);
    }
    return substr(Config::get('menu_sort'), -4) === 'desc' ? array_reverse($dirs) : $dirs;
  }
}

// class Dir / loads data array for a single dir with or without files
class Dir {

  // vars
  public $data; // array of public data to be returned / shared with File
  public $path; // path of dir / shared with File
  public $realpath; // dir realpath, normally the same as $path, unless $path contains symlink
  public $relpath; // dir path relative to root
  public $memory_limit_mb; // get memory_limit_mb as it might be required by exif_read_data()
  private $filemtime; // dir filemtime (modified time), used for cache validation and data
  private $filenames; // array of file names in dir
  private $cache_path; // calculated json file cache path

  // construct assign common vars
  public function __construct($path){
    $this->path = $path;
    $this->realpath = $path ? Path::realpath($path) : false;
    $this->relpath = Path::relpath($this->path);
    $this->filemtime = filemtime($this->realpath);
    $this->cache_path = $this->get_cache_path();
  }

  // get dir json from cache, or reload / used by main dir files action request
  public function json(){

    // return json cache file if exists
    if(U::readfile($this->cache_path, 'application/json', 'JSON served from cache')) return;

    // reload, encode as json, and store json cache file
    Json::cache($this->load(true), 'JSON created', $this->cache_path);
  }

  // get dir array from cache or reload / used in Document class when getting dir arrays for root and start path
  public function get(){

    // get cache if valid, also returns files[] array as bonus since it's already cached
    if($this->cache_is_valid()) return json_decode(file_get_contents($this->cache_path), true);

    // reload dir without files (we don't want to delay Document with this, unless cached)
    return $this->load();
  }

  // load dir array / used when dir is not cached (always by menu get_dirs())
  public function load($files = false){

    // dir array
    $this->data = [
      'basename' => U::basename($this->path),
      'fileperms' => substr(sprintf('%o', fileperms($this->realpath)), -4),
      'filetype' => 'dir',
      'is_readable' => is_readable($this->realpath),
      'is_writeable' => is_writeable($this->realpath),
      'is_link' => is_link($this->path),
      'is_dir' => true,
      'mime' => 'directory',
      'mtime' => $this->filemtime,
      'path' => $this->relpath,
      'files_count' => 0,
      'dirsize' => 0,
      'images_count' => 0,
      'url_path' => Path::rooturlpath($this->relpath),
    ];

    // get files[] array for dir
    if($files) {
      // memory_limit_mb might be required to check if we can use exif_read_data()
      if(!isset($this->memory_limit_mb)) $this->memory_limit_mb = U::get_memory_limit_mb();
      $this->get_files();
    }

    // assign direct url to json cache file for faster loading from javascript / used by Dirs class (menu), only when !files
    // won't work if you have blocked public web access to cache dir files / if so, comment out the below line
    if(!$files) $this->set_json_cache_url();

    // return data array for this dir
  	return $this->data;
  }

  // get json cache path for dir (does not validate if cache file exists)
  private function get_cache_path(){
    if(!Config::get('cache') || !$this->path) return;
    return Config::$cachepath . '/folders/' . U::dirs_hash() . '.' . substr(md5($this->path), 0, 6) . '.' . $this->filemtime . '.json';
  }

  // used to check if json cache file exists, and therefore is valid
  private function cache_is_valid(){
    return $this->cache_path && file_exists($this->cache_path);
  }

  // assign direct url to json cache file for faster loading from javascript / used by Dirs class (menu)
  private function set_json_cache_url(){
    // don't allow direct access if login or !public or !valid cache
    if(Config::$is_logged_in || !$this->cache_is_valid() || !Path::is_within_docroot(Config::$storagepath)) return;
    $this->data['json_cache'] = Path::urlpath($this->cache_path);
  }

  // optional get array of files from dir / only gets called if file data should be loaded
  private function get_files(){

    // forget it if we can't read dir
    if(!$this->data['is_readable']) return;

    // start files array, even if empty (so we know it's an empty folder)
    $this->data['files'] = [];

    // scandir for filenames
    $this->filenames = scandir($this->path, SCANDIR_SORT_NONE);

    // exit if dir is empty
    if(empty($this->filenames)) return;

    // loop filenames add to $this->data['files']
    foreach($this->filenames as $filename) {

      // skip dots
      if(in_array($filename, ['.', '..'])) continue;

      // add file to $this->data['files'] array
      new File($this, $filename);
  	}

    // sort files by natural case, with dirs on top (already sorts in javascript, but faster when pre-sorted in cache)
    uasort($this->data['files'], function($a, $b){
      if($a['is_dir'] === $b['is_dir']) return strnatcasecmp($a['basename'], $b['basename']);
      return $b['is_dir'] ? 1 : -1;
    });
  }
}

// class File / returns data array for a single file
class File {

  // vars
  private $dir; // parent dir object
  private $file; // file array
  private $realpath; // realpath of item, in case symlinked, faster access for various operations
  private $image = []; // image data array, populated and assigned to $this->file['image'] if file is image
  private $image_info; // image_info from getimagesize() to get IPTC

  // public construct file
  public function __construct($dir, $filename){

    // parent dir object
    $this->dir = $dir;

    // assemble full path from parent dir path
    $path = $this->dir->path . '/' . $filename;

    // get resolved realpath, to check if file truly exists (symlink target could be deaf), and for faster function access
    $this->realpath = Path::realpath($path); // may differ from $path if symlinked

    // exit if no realpath for some reason, for example symlink target is dead
    if(!$this->realpath) return;

    // path is symlinked if realpath differs from $path
    $symlinked = $this->realpath !== $path;

    // get filetype
    $filetype = filetype($this->realpath);

    // determine if file is dir
    $is_dir = $filetype === 'dir' ? true : false;

    // skip item if excluded
    if(Path::is_exclude($path, $is_dir, $symlinked)) return;

    // count file into parent dir
    if(!$is_dir) $this->dir->data['files_count'] ++;

    // check if file is symlink (only if realpath !== path)
    $is_link = $symlinked ? is_link($path) : false;

    // get filesize if !$is_dir
    $filesize = $is_dir ? 0 : filesize($this->realpath); // filesize($path) if we only want to get size of symlink (0)

    // get relative path by appending filename to dir path
    $relpath = ltrim($this->dir->data['path'] . '/', '/') . $filename;

    // append filesize to parent dirsize
    $this->dir->data['dirsize'] += $filesize;

    // add properties to file array
    $this->file = [
      'basename' => $filename,
      'ext' => $is_dir ? '' : U::extension($is_link ? $this->realpath : $filename, true),
      'fileperms' => substr(sprintf('%o', fileperms($this->realpath)), -4),
      'filetype' => $filetype,
      'filesize' => $filesize,
      'is_readable' => is_readable($this->realpath),
      'is_writeable' => is_writeable($this->realpath),
      'is_link' => $is_link,
      'is_dir' => $is_dir,
      'mtime' => filemtime($this->realpath),
      'path' => $relpath,
      'url_path' => Path::rooturlpath($relpath),
    ];

    // assign file mime type / will return null for most files unless config get_mime_type = true (slow)
    $this->file['mime'] = $this->mime();

    // assign image data if file is image
    $this->set_image_data();

    // read .URL shortcut files and present as links / https://fileinfo.com/extension/url
    $this->set_file_url();

    // add to dir files array with filename as key
    $this->dir->data['files'][$filename] = $this->file;
  }

  // get file mime type if !extension of config get_mime_type is enabled
  private function mime(){
    if($this->file['is_dir']) return 'directory'; // directory
    if(!$this->file['is_readable']) return null; // skip and return null
    if(!$this->file['ext'] || $this->file['ext'] === 'ts' || Config::get('get_mime_type')) return U::mime($this->realpath);
    return null; // don't check mime, mime will be detected from extension in javascript
  }

  // we need to make sure memory is sufficient before using exif_read_data() so folders doesn't break on massive image files
  // this is a very rough estimation
  private function memory_sufficient_exif(){
    return !$this->dir->memory_limit_mb || $this->dir->memory_limit_mb > ($this->image['width'] * $this->image['height'] * ($this->image['bits'] ?? 8) / 8 * ($this->image['channels'] ?? 4) * 1.5) / 1048576;
  }

  // assign image data if file is image
  private function set_image_data(){

    // first check if item seems like an image by checking mime or extension
    if(!$this->is_image()) return;

    // count image in dir, assuming it's some kind of image, even if !getimagesize() or !readable
    $this->dir->data['images_count'] ++;

    // pre-assign image icon, assuming it's some kind of image, even if !getimagesize() or !readable
    $this->file['icon'] = 'image';

    // getimagesize() wrapper, populates and re-formats $this->image / exit if empty
    if(!$this->getimagesize()) return;

    // assign item mime from getimagesize() because it is more accurate and we might not have file mime yet anyway
    if(isset($this->image['mime'])) $this->file['mime'] = $this->image['mime'];

    // get image Iptc
    $this->image['iptc'] = Iptc::get($this->image_info);

    // get image Exif if we anticipate memory is sufficient
    if($this->memory_sufficient_exif()) $this->image['exif'] = Exif::get($this->realpath);

    // invert image width height if exif orientation is > 4 && < 9, because dimensions should match browser-oriented image
    $this->image_orientation_flip_dimensions();

    // find optional panorama sizes `_files_{size}_{filename.jpg}` for equirectangular 2/1 aspect panorama images
    $this->image_panorama_sizes();

    // get image resize cache for direct access by javascript if config image_resize_cache_direct
    $this->get_image_resize_cache();

    // remove empty values and add image array to file output
    $this->file['image'] = array_filter($this->image);
  }

  // check if file seems to be an image by means of mime type or extension
  private function is_image(){
    if($this->file['is_dir']) return;
    if($this->file['mime']) return strpos($this->file['mime'], 'image/') === 0;
    return in_array($this->file['ext'], ['gif','jpg','jpeg','jpc','jp2','jpx','jb2','png','swf','psd','bmp','tiff','tif','wbmp','xbm','ico','webp','avif','svg']);
  }

  // getimagesize() wrapper validates and re-formats output into $this->image array
  private function getimagesize(){

    // exit
    if(!$this->file['is_readable'] || $this->file['ext'] === 'svg') return;

    // getimagesize()
    $imagesize = @getimagesize($this->realpath, $this->image_info);

    // exit on invalid $imagesize
    if(empty($imagesize) || !is_array($imagesize)) return;

    // re-format properties from getimagesize() into $this->image array
    foreach ([
      'width',
      'height',
      'type',
      'bits' => 'bits',
      'channels' => 'channels',
      'mime' => 'mime'
    ] as $key => $name) if(isset($imagesize[$key])) $this->image[$name] = $imagesize[$key];

    // valid if array is !empty
    return !empty($this->image);
  }

  // if image is oriented by some Exif orientation values, we need to flip width and height properties to match browser orientation
  private function image_orientation_flip_dimensions(){
    if(!isset($this->image['exif']['Orientation']) || !in_array($this->image['exif']['Orientation'], [5, 6, 7, 8])) return;
    list($this->image['width'], $this->image['height']) = [$this->image['height'], $this->image['width']]; // flip width/height
  }

  // find optional panorama sizes `_files_{size}_{filename.jpg}` for equirectangular 2/1 aspect panorama images
  private function image_panorama_sizes(){
    // must be public image (url_path), with >= 2024 and exactly 2:1 aspect ratio (equirectangular)
    if(!$this->file['url_path'] || !$this->image['width'] || $this->image['width'] <= 2048 || $this->image['width'] / $this->image['height'] !== 2) return;
    $resized = [];
    foreach ([2048, 4096, 8192] as $width) { // look for sizes 2048, 4096 and 8192
      if($width >= $this->image['width']) break; // break loop if resized image width >= original already
      if(file_exists($this->dir->realpath . '/_files_' . $width . '_' . $this->file['basename'])) $resized[] = $width;
    }
    if(!empty($resized)) $this->file['panorama_resized'] = array_reverse($resized);
  }

  // get image resize cache for direct access by javascript if config image_resize_cache_direct
  private function get_image_resize_cache(){
    if(!U::image_resize_cache_direct()) return;
    foreach ([Config::get('image_resize_dimensions'), U::image_resize_dimensions_retina()] as $resize) {
      if(!$resize) continue;
      $cache_file = Path::imagecachepath($this->realpath, $resize, $this->file['filesize'], $this->file['mtime']);
      if(file_exists($cache_file)) $this->image["resize$resize"] = Path::urlpath($cache_file);
    }
  }

  // read and parse .URL shortcut files and present as links / https://fileinfo.com/extension/url
  private function set_file_url(){
    if(!$this->file['is_readable'] || $this->file['ext'] !== 'url') return;
    $lines = @file($this->realpath);
    if(empty($lines) || !is_array($lines)) return;
    foreach ($lines as $str) {
      if(!preg_match('/^url\s*=\s*([\S\s]+)/i', trim($str), $matches) || !isset($matches[1])) continue;
      $this->file['url'] = $matches[1];
      break;
    }
  }
}

// class Iptc / extract IPTC image data from images
class Iptc {

  // array of iptc entries with their corresponding codes to extract from IPTC, which otherwise contains tons of junk
  public static $entries = [
    'title' => '005',
    'headline' => '105',
    'description' => '120',
    'creator' => '080',
    'credit' => '110',
    'copyright' => '116',
    'keywords' => '025',
    'city' => '090',
    'sub-location' => '092',
    'province-state' => '095'
  ];

  // get iptc tag values, might be an array (keywords) or first array item (string) / attempts to fix invalid utf8
  private static function tag($value){

    // might be an array like 'keywords', just output array
    if(count($value) > 1) return $value;

    // get trimmed string value
    $string = isset($value[0]) && is_string($value[0]) ? trim($value[0]) : false;

    // invalid or empty string
    if(empty($string)) return false;

    // clamp string at 1000 chars, because some messed up images include a dump of garbled junk
    $clamped = function_exists('mb_substr') ? @mb_substr($string, 0, 1000) : @substr($string, 0, 1000);

    // return original string if the above didn't work for some ridiculous reason
    if(!$clamped) return $string;

    // return string if we can't detect valid utf-8 or string is already valid utf-8
    if(!function_exists('mb_convert_encoding') || preg_match('//u', $clamped)) return $clamped;

    // attempt to convert the encoding
    $converted = @mb_convert_encoding($clamped, 'UTF-8', @mb_list_encodings());

    // return converted value if successful
    return $converted ?: $clamped;
  }

  // get iptc from $image_info (getimagesize($path, $image_info))
  public static function get($i){

    // get iptc from $image_info (getimagesize($path, $image_info))
    $iptc = !empty($i) && is_array($i) && isset($i['APP13']) && function_exists('iptcparse') ? @iptcparse($i['APP13']) : false;

    // return empty array if falsy, error or empty[] response
    if(empty($iptc)) return [];

    // populate $entries from $iptc
    $output = [];
    foreach (self::$entries as $name => $code) {
      $value = isset($iptc['2#' . $code]) ? $iptc['2#' . $code] : false;
      $output[$name] = !empty($value) && is_array($value) ? self::tag($value) : false;
    }

    // return array with all non-empty values
    return array_filter($output);
  }
}

// class Exif / extract Exif image data from images
class Exif {

  // these are the values we want
  public static $entries = [
    'ApertureFNumber',  // from exif COMPUTED values
    //'CCDWidth'        // from exif COMPUTED values
    //'DateTime',       // only used to detect original photo time, if DateTimeOriginal is not defined
    'DateTimeOriginal', // original photo taken time, which will replace the file's date
    'ExposureTime',
    //'FNumber',
    'FocalLength',
    //'Make',           // normally pointless when there is 'Model'
    'Model',
    'Orientation',      // used only for Javascript to detect the orientation of the image and display appropriately
    'ISOSpeedRatings',
    //'Software',
  ];

  // returns the exif data array from an image, if function exists and exif array is valid
  public static function exif_data($path){
    $exif = function_exists('exif_read_data') ? @exif_read_data($path) : false;
    return !empty($exif) && is_array($exif) ? $exif : false;
  }

  // get Exif $entries for a specific image
  public static function get($path){

    // get exif
    $exif = self::exif_data($path);
    if(!$exif) return;

    // start output array
    $output = [];

    // loop $entries, check in $exif and $exif['COMPUTED'] and add to ouput
    foreach (self::$entries as $key) {
      $output[$key] = isset($exif[$key]) ? $exif[$key] : (isset($exif['COMPUTED'][$key]) ? $exif['COMPUTED'][$key] : false);
    }

    // get GPS coordinates
    $output['gps'] = self::gps($exif);

    // remove empty values and return array
    return array_filter($output);
  }

  // get GPS coordinates in array
  private static function gps($exif){

    // prepare array for coordinates
    $arr = [];

    // loop to get coordinates
    foreach (['GPSLatitude', 'GPSLongitude'] as $key) {

      // invalid exif
      if(!isset($exif[$key]) || !isset($exif[$key . 'Ref'])) return false;

      // coordinate array
      $coordinate = is_string($exif[$key]) ? array_map('trim', explode(',', $exif[$key])) : $exif[$key];

      // loop
      for ($i = 0; $i < 3; $i++) {
        $part = explode('/', $coordinate[$i]);
        if(count($part) == 1) {
          $coordinate[$i] = $part[0];
        } else if (count($part) == 2) {
          if(empty($part[1])) return false; // invalid GPS, $part[1] can't be 0
          $coordinate[$i] = floatval($part[0]) / floatval($part[1]);
        } else {
          $coordinate[$i] = 0;
        }
      }

      // output
      list($degrees, $minutes, $seconds) = $coordinate;
      $sign = in_array($exif[$key . 'Ref'], ['W', 'S']) ? -1 : 1;
      $arr[] = $sign * ($degrees + $minutes / 60 + $seconds / 3600);
    }

    // return array
    return !empty($arr) ? $arr : false;
  }
}

// class Filemanager / functions that handle file operations on server
class Filemanager {

  // success counter for multi-item actions
  static $success = 0;
  static $count = 0;

  // file manager actions JSON response / accepts true/false or array with success property
  public static function json($res, $err){

    // create $arr from boolean with $arr['success'] or pass through existing array
    $arr = is_array($res) ? $res : ['success' => $res];

    // assign complete error if action was !success (not even partially success)
    if(!isset($arr['success']) || empty($arr['success'])) return Json::error($err);

    // on success, invalidate X3 cache if x3-plugin active
    X3::invalidate();

    // output success / remove empty values, because javascript don't need em
    Json::jexit(array_filter($arr));
  }

  // check if name is allowed and return trimmed value / duplicate, new_file, new_folder, rename, zip
  // for security and practical reasons, don't allow invalid characters <>:"'/\|?*# or .. or ends with .
  public static function name_is_allowed($name = false){
    return !empty($name) && is_string($name) && !ctype_space($name) && !preg_match('/[<>:"\'\/\\\|?*#]|\.\.|\.$/', $name);
  }

  // get unique incremental filename for functions like duplicate and zip / default increment name starts at 2
  public static function get_unique_filename($path, $i = 2) {

    // die if already unique
    if(!file_exists($path)) return $path;

    // break path into filename and extension
    $pathinfo = pathinfo($path);
    $filename = $pathinfo['filename']; // file name without extension for numbering
    $ext = !is_dir($path) && !empty($pathinfo['extension']) ? '.' . $pathinfo['extension'] : ''; // extension append to filename

    // check if file is numbered already like file-3.jpg, so we can assign to file-4.jpg instead of file-3-2.jpg
    $numbered_name = explode('-', $filename);
    $current_count = array_pop($numbered_name);
    if(count($numbered_name) && is_numeric($current_count)) {
      $filename = join('-', $numbered_name);
      $i = $current_count + 1;
    }

    // increment filename if file already exists / default start by filename-2.ext
    while (file_exists($path)) {
      $path = $pathinfo['dirname'] . '/' . $filename . '-' . $i . $ext;
      $i++;
    }

    // return first available $path
    return $path;
  }

  // recursive iterator for copy, delete, duplicate
  protected static function iterator($path, $mode = RecursiveIteratorIterator::SELF_FIRST){
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path, RecursiveDirectoryIterator::SKIP_DOTS), $mode, RecursiveIteratorIterator::CATCH_GET_CHILD);
    self::$count += iterator_count($iterator);
    return $iterator;
  }

  // delete single file or folder
  private static function delete_file_or_folder($path){
    return is_dir($path) && !is_link($path) ? @rmdir($path) : @unlink($path);
  }

  // delete single file or folder recursively
  public static function delete($path){

    // if dir, iterate recursively and attempt to delete all descendants / don't iterate if is symlink
    // check if_writeable() will skip dirs that are not writeable, because we can't delete direct children. However, we may still be able to delete deep descendants, so might as well try to delete what can be deleted.
    if(is_dir($path) && !is_link($path)/* && is_writable($path)*/) foreach (self::iterator($path, RecursiveIteratorIterator::CHILD_FIRST) as $item) self::$success += self::delete_file_or_folder($item->getPathname());

    // delete file or folder after first deleting recursive items in folder
    return self::delete_file_or_folder($path);
  }

  // non-recursive copy single file or folder / creates folder when necessary
  private static function copy_file_or_folder($from, $to){
    // if(Path::is_exclude($to, is_dir($from))) return false; // exclude copy $to paths? kinda pointless
    if(Path::is_within_path($to, $from)) return false; // don't allow copying files or dirs into self or same location
    //if(!is_readable($from)) return false; // already checked in valid_rootpath() filter
    // if item is symlink, we recreate the symlink in $to location
    // we can't copy() symlinks and we don't want to copy the original target file or dir of the $from symlink
    if(is_link($from)) {
      if(!function_exists('symlink')) return false; // can't proceed if symlink() doesn't work
      $target = @realpath(readlink($from)) ?: $from; // attempt to resolve symlink, so we don't end up with a chain of symlinks
      return @symlink($target, $to); // create symlink
    }
    if(is_dir($from)) return is_dir($to) || @mkdir($to, 0777, true); // is_dir already or make new dir
    if(!is_readable($from)) return false; // can't read file source / might be recursive file
    if(file_exists($to) && filemtime($to) >= filemtime($from)) return false; // file already exists and is newer than source
    if(!@copy($from, $to)) return false; // attempt to copy from to / overwrite existing older files in $to location
    @touch($to, filemtime($from)); // inherit file modified time
    return true; // return success
  }

  // copy single file or folder recursively / kinda how the default php copy() should have worked? Also used for duplicate
  public static function copy($from, $to){
    if(!self::copy_file_or_folder($from, $to)) return false; // only continue on success
    // copy dirs recursively, unless symlink (the dir symlink is already copied, and we don't want to clone the entire symlink target)
    if(is_dir($from) && !is_link($from)) {
      $iterator = self::iterator($from);
      foreach ($iterator as $descendant) self::$success += self::copy_file_or_folder($descendant, $to . '/' . $iterator->getSubPathName());
    }
    return true;
  }

  // move file or folder / uses rename() wihch is recursive by default
  private static function move($from, $to){
    // if(Path::is_exclude($to, is_dir($from))) return false; // exclude move $to paths? Kinda pointless
    if(Path::is_within_path($to, $from)) return false; // don't allow moving files or dirs into self or same location
    if(file_exists($to) && filemtime($to) >= filemtime($from)) return false; // $to already exists and is newer than $from
    // if symlink and symlink target is relative, attempt to write symlink with canonical path to preserve symlink target
    if(is_link($from) && function_exists('symlink') && !@realpath(readlink($from))) {
      $target = @realpath(dirname($from) . '/' . readlink($from)); // attempt to resolve path relative to owner dir of symlink
      if($target) return @symlink($target, $to);
    }
    return @rename($from, $to); // can overwrite existing older files, but fails to overwrite non-empty dirs, which is ok
  }

  // duplicate single file or folder recursively incrementing filename (if filename provided, use copy($from, $to) instead)
  public static function duplicate($path){

    // copy item recursively with unique incremental file name
    return self::copy($path, self::get_unique_filename($path));
  }

  // run action on array of files and folders / return succes/fail array
  public static function items($action, $paths, $dir = false){

    // count paths / recursive iterators may add to count
    self::$count = count($paths);

    // loops paths
    foreach ($paths as $path) self::$success += self::$action($path, ($dir ? $dir . '/' . U::basename($path) : false));

    // return success and fail count
    return ['success' => self::$success, 'fail' => self::$count - self::$success];
  }

  // return an array of downloadable files from within an array of $paths
  public static function get_downloadables($paths){

    // prepare downloadables array
    $downloadables = [];

    // loop dir $paths / only dir $paths are forwarded to check recursively, as JS already knows the files
    foreach ($paths as $dir) {
      //if(is_link($dir)) continue; // un-comment if you dont' want downloads to follow symlinks / also inside foreach loop
      if(Path::is_exclude($dir, true)) continue; // shouldn't be necessary when forwarded from frontend, but just in case
      foreach (self::iterator($dir) as $item) { // loop dirs get all descendants
        $path = $item->getPathname();

        // create download list from readable, non-excluded files only (not dirs, as we don't download a dir)
        if(!is_readable($path) || is_dir($path) || Path::is_exclude($path, false)/* || is_link($path)*/) continue;

        // prepare relative app path
        $relpath = Path::relpath($path);

        // append to downloadables array
        $downloadables[] = [
          'path' => $relpath,
          'url_path' => Path::rooturlpath($relpath),
          'basename' => U::basename($path),
          'ext' => U::extension($path),
          'filesize' => filesize($path)
        ];
      }
    }

    // return downloadables array
    return $downloadables;
  }
}

// class Zipper / extends Filemanager / create and extract zip files
class Zipper extends Filemanager {

  // vars
  private $zip;
  private $is_json;

  // construct check class_exists('ZipArchive') and create new ZipArchive
  public function __construct($is_json = false){
    $this->is_json = $is_json;
    if(!class_exists('ZipArchive')) U::error('Missing PHP ZipArchive class', 500, $this->is_json);
    $this->zip = new ZipArchive();
  }

  // generic open zip with errors
  private function open($dest, $flags = null){

    // open zip
    $res = @$this->zip->open($dest, $flags);

    // return error type messages / https://www.php.net/manual/en/ziparchive.open.php
    $zip_open_errors = [
      4 => 'Seek error.',
      5 => 'Read error.',
      9 => 'No such file.',
      11 => 'Can\'t open file.',
      10 => 'File already exists.',
      14 => 'Malloc failure.',
      18 => 'Invalid argument.',
      19 => 'Not a zip archive.',
      21 => 'Zip archive inconsistent.'
    ];

    //  die if error
    if($res !== true) U::error($res && isset($zip_open_errors[$res]) ? $zip_open_errors[$res] : 'Unknown zip error', 500, $this->is_json);
  }

  // extract $zip_file into $dir (optional) / $dir is parent of zip if not set
  public function extract($zip_file, $dir = false){

    // check valid zip
    if(!is_file($zip_file) || U::extension($zip_file, true) !== 'zip' || empty(filesize($zip_file))) U::error('Invalid zip file', 400, $this->is_json);

    // $dir is parent of zip if not set
    if(!$dir) $dir = dirname($zip_file);

    // check target_dir writeable
    if(!is_writable($dir)) U::error('Target dir is not writeable', 403, $this->is_json);

    // open zip file
    $this->open($zip_file);

    // extract to target_dir
    $success = @$this->zip->extractTo($dir);

    // return always close() and $success
    return @$this->zip->close() && $success;
  }

  // create a new $zip_file from multiple $paths
  public function create($paths, $zip_file = false){

    //
    $first_path = reset($paths);

    // create zip root from first array path, so we can create relative local paths inside zip
    $root = dirname($first_path) . '/';

    // unique incremental 'archive.zip' if multiple paths or filename.jpg.zip (don't append .zip if extension already zip)
    if(!$zip_file) $zip_file = self::get_unique_filename($root . (count($paths) > 1 ? 'archive.zip' : U::basename($first_path) . (U::extension($first_path, true) !== 'zip' ? '.zip' : '')));

    // create new zip file or die
    $this->open($zip_file, ZipArchive::CREATE | ZipArchive::OVERWRITE);

    // loop $paths to add files
    foreach ($paths as $path) {

      // add file or dir / if added and is_dir, add file or dir recursively
      if($this->add_file_or_dir($path, $root) && is_dir($path)) foreach(self::iterator($path) as $file) $this->add_file_or_dir($file, $root);
    }

    // detect files count in zip
    $num_files = version_compare(PHP_VERSION, '7.2.0') >= 0 ? $this->zip->count() : $this->zip->numFiles;

    // success only if close() and has files and zip file exists in tar
    return $this->zip->close() && !empty($num_files) && file_exists($zip_file);
  }

  // add_file_or_dir
  private function add_file_or_dir($path, $root){
    //if(is_link($path)) return; // un-comment if zip should not follow symlinks
    if(Path::is_exclude($path, is_dir($path)) || !is_readable($path)) return false; // file excluded, continue
    $local_path = str_replace($root, '', $path); // local path relative to root
    return is_dir($path) ? @$this->zip->addEmptyDir($local_path) : @$this->zip->addFile($path, $local_path);
  }
}

// class Request / extract parameters for all actions
class Request {

  // vars
  public $action;
  public $params;
  public $is_post;

  // construct
  public function __construct(){
    $this->action = U::get('action');
    $this->is_post = $_SERVER['REQUEST_METHOD'] === 'POST';
    $this->params = $this->get_request_data();
    if(!is_array($this->params)) $this->error('Invalid parameters');
  }

  // check if $action ios allowed
  public function action_allowed(){
    $c = 'allow_' . $this->action; // get allow_$action
    if(!isset(Config::$config[$c])) return true; // allowed if allow_$action config option doesn't exit
    // allow_all override allows all actions
    if(Config::get('allow_all') && !in_array($this->action, ['check_updates', 'tests', 'tasks'])) return Config::$config[$c] = true;
    return Config::get($c);
  }

  // get request data parameters
  public function get_request_data(){
    if(!$this->is_post) return $_GET;
    if(isset($_POST) && !empty($_POST)) return $_POST;
    $php_input = @json_decode(@trim(@file_get_contents('php://input')), true); // javascript fetch()
    return $php_input ?: [];
  }

  // get specific string value parameter from data (dir, file path etc)
  public function param($param){
    if(!isset($this->params[$param])) return false;
    if(!is_string($this->params[$param])) $this->error("Invalid $param parameter"); // must be string if exists
    return trim($this->params[$param]); // trim it
  }

  // error response based on request type / 400 Bad Request default / 401, 403, 404, 500
  public function error($err, $code = 400){
    if($this->is_post) return Json::error($err);
    U::error($err, $code);
  }
}

// class Document / creates the main Files Gallery document response
class Document {

  // private Document class vars
  private $start_path = ''; // start_path extracted and validated from query or $config['start_path']
  private $absolute_start_path = false; // absolute path of start_path, for validation and dirs preload
  private $dirs = []; // array of dirs to be preloaded, normally root and query or start_path (if not same as root)
  private $menu_exists = false; // determines if menu exists from config and checks for dirs in root
  private $menu_cache_hash = false; // assign a menu cache hash so menu cache can be validated on load
  private $menu_cache_file = false; // assign direct access to menu json cache file when menu_cache_validate is disabled

  // document construct tasks
  public function __construct(){

    // first we must get and validate start_path from ?query or config start_path
    $this->get_start_path();

    // always get root dir array (outputs as json, for javascript)
    $this->dirs[''] = (new Dir(Config::$root))->get();

    // get start path dir (if valid and not same as root, in case symlinked)
    if($this->absolute_start_path && Path::realpath($this->absolute_start_path) !== Config::$root) $this->dirs[$this->start_path] = (new Dir($this->absolute_start_path))->get();

    // prepare menu variables menu_exists, menu_cache_hash and menu_cache_file
    $this->prepare_menu();

    // output main Files Gallery document HTML
    $this->HTML();
  }

  // get start_path from ?query or from config start_path (if set)
  private function get_start_path(){

    // first check if we have a query path
    $query_path = $this->get_query_path();

    // we have a query path (although it's not necessarily a valid dir)
    if($query_path){

      // assign query_path as start_path
      $this->start_path = $query_path;

      // check and return valid root path from query path
      $this->absolute_start_path = Path::valid_rootpath($this->start_path, true);

    // start path from config with error response invalid (path must exist, non-excluded and must be inside root)
    } else if(Config::get('start_path')) {

      // get realpath from config start_path
      $this->absolute_start_path = Path::realpath(Config::get('start_path'));

      // error if path does not exist or !is within root or is_exclude
      if(!$this->absolute_start_path || !Path::is_within_path($this->absolute_start_path, Config::$root) || Path::is_exclude($this->absolute_start_path)) U::error('Invalid start_path ' . Config::get('start_path'));

      // assign root-relative start_path to forward to javascript
      $this->start_path = Path::relpath($this->absolute_start_path);
    }
  }

  // parse query_string and get first ?parameter to be considered path
  private function get_query_path(){
    if(empty($_SERVER['QUERY_STRING'])) return; // exit if !QUERY_STRING
    $path = explode('&', $_SERVER['QUERY_STRING'])[0]; // get first parameter in QUERY_STRING for path
    if(!$path || strpos($path, '=') !== false) return; // make sure path exists and is not assigned parameter=value
    return trim(rawurldecode($path), '/'); // trime and decode
  }

  // prepare main menu variables
  private function prepare_menu(){

    // exit if !menu_enabled
    if(!Config::get('menu_enabled')) return;

    // get root dirs / used to decide if menu_exists, breadcrumbs and to generate shallow menu_cache_hash
    $root_dirs = array_filter(glob(Config::$root . '/*', GLOB_ONLYDIR|GLOB_NOSORT), function($dir){
      return !Path::is_exclude($dir, true, is_link($dir));
    });

    // menu exists only if root_dirs is not empty
    $this->menu_exists = !empty($root_dirs);

    // exit if !menu_exists
    if(!$this->menu_exists) return;

    // get menu_cache_hash used to validate first level shallow menu cache and when !menu_cache_validate
    $this->get_menu_cache_hash($root_dirs);

    // get JSON menu_cache_file to forward to Javascript if menu_cache_validate is disabled
    $this->get_menu_cache_file();
  }

  // menu_cache_hash used to validate first level shallow menu cache (no validation required) and when !menu_cache_validate
  private function get_menu_cache_hash($root_dirs){
    $mtime_count = filemtime(Config::$root);
    foreach ($root_dirs as $root_dir) $mtime_count += filemtime($root_dir);
    // create hash based on various parameters that may affect the menu
    $this->menu_cache_hash =  substr(md5(Config::$document_root . Config::$__dir__ . Config::$root), 0, 6) . '.' . substr(md5(Config::$version . Config::get('cache_key') . Config::get('menu_max_depth') . Config::get('menu_load_all') . (Config::get('menu_load_all') ? Config::get('files_exclude') . U::image_resize_cache_direct() : '') . Config::get('dirs_exclude') . Config::get('menu_sort')), 0, 6) . '.' . $mtime_count;
  }

  // get JSON menu_cache_file to forward to Javascript if menu_cache_validate is disabled
  private function get_menu_cache_file(){

    // exit if menu_cache_validate or !cache or !storage is_within_doc_root
    if(Config::get('menu_cache_validate') || !Config::get('cache') || !Path::is_within_docroot(Config::$storagepath)) return;

    // check if valid menu json cache file exists
    $path = Config::$cachepath . '/menu/' . $this->menu_cache_hash . '.json';
    $url_path = file_exists($path) ? Path::urlpath($path) : false;
    if($url_path) $this->menu_cache_file = $url_path . '?' . filemtime($path);
  }

  // output main Files Gallery document HTML
  private function HTML(){

    // main document, output version, request time and memory
    U::header('Version ' . Config::$version);

    // main document html start
    U::html_header($this->start_path ? U::basename($this->start_path) : './', 'menu-' . ($this->menu_exists ? 'enabled' : 'disabled sidebar-closed'));
    ?>
    <body class="body-loading">
      <main id="main">
        <nav id="topbar" class="topbar-sticky">
          <div id="topbar-top">
            <div id="search-container"><input id="search" class="input" type="search" placeholder="search" size="1" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off" disabled></div>
            <div id="change-layout" class="dropdown"></div>
            <div id="change-sort" class="dropdown"></div>
          </div>
          <div id="topbar-breadcrumbs"></div>
          <div id="files-sortbar"></div>
          <div class="topbar-select"></div>
          <div id="topbar-info" class="info-hidden"></div>
        </nav>
        <div id="files-container"><div id="files" class="list files-<?php echo Config::get('layout'); ?>"></div></div>
      </main>

      <?php if($this->menu_exists) { ?>
      <aside id="sidebar">
        <button id="sidebar-toggle" type="button" class="button-icon"></button>
        <div id="sidebar-inner">
          <div id="sidebar-topbar"></div>
          <div id="sidebar-menu"></div>
        </div>
      </aside>
      <div id="sidebar-bg"></div>
      <?php } ?>

      <div id="contextmenu" class="dropdown-menu" tabindex="-1"></div>

      <?php U::uinclude('include/footer.html'); ?>

<!-- javascript -->
<script>
const _c = <?php echo json_encode($this->get_javascript_config(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_PARTIAL_OUTPUT_ON_ERROR); ?>;
var CodeMirror = {};
</script>
<?php

// load _files/js/custom.js if the file exists
U::uinclude('js/custom.js');

// preload all Javascript assets
foreach (array_filter([
  'toastify-js@1.12.0/src/toastify.min.js',
  'sweetalert2@11.12.3/dist/sweetalert2.min.js',
  'animejs@3.2.2/lib/anime.min.js',
  'yall-js@3.2.0/dist/yall.min.js',
  'filesize@9.0.11/lib/filesize.min.js',
  'screenfull@5.2.0/dist/screenfull.min.js',
  'dayjs@1.11.12/dayjs.min.js',
  'dayjs@1.11.12/plugin/localizedFormat.js',
  'dayjs@1.11.12/plugin/relativeTime.js',
  (in_array(Config::get('download_dir'), ['zip', 'files']) ? 'js-file-downloader@1.1.25/dist/js-file-downloader.min.js' : false),
  'file-saver@2.0.5/dist/FileSaver.min.js',
  'jszip@3.10.1/dist/jszip.min.js',
  'codemirror@6.65.7/mode/meta.js',
  'files.photo.gallery@' . Config::$version . '/js/files.js'
]) as $key) echo '<script src="' . U::assetspath() . $key . '"></script>' . PHP_EOL;
?></body></html><?php
  // end HTML
  }

  // get Javascript config array / includes config properties and calculated values specifically for Javascript
  private function get_javascript_config(){

    // exclude config user settings for frontend (Javascript) when sensitive and/or not used in frontend
    $exclude = [
      'root',
      'root_url_path',
      'start_path',
      'image_resize_cache',
      'image_resize_quality',
      'image_resize_function',
      'image_resize_cache_direct',
      'menu_load_all',
      'cache_key',
      'storage_path',
      'files_exclude',
      'dirs_exclude',
      'username',
      'password',
      'allow_tasks',
      'allow_symlinks',
      'menu_recursive_symlinks',
      'image_resize_sharpen',
      'get_mime_type',
      'license_key',
      'video_thumbs',
      'video_ffmpeg_path',
      'pdf_thumbs',
      'imagemagick_path',
      'folder_preview_default',
      'image_resize_dimensions_allowed',
      'download_dir_cache',
      'imagemagick_path',
    ];

    // create config array without excluded items
    $config = array_diff_key(Config::$config, array_flip($exclude));

    // return Javascript config array, merged (some values overridden) with main $config
    return array_replace($config, [
      'script' => U::basename(__FILE__), // so JS knows where to post
      'menu_exists' => $this->menu_exists, // so JS knows if menu exists
      'menu_cache_hash' => $this->menu_cache_hash, // hash to post from JS when loading menu to check cache
      'menu_cache_file' => $this->menu_cache_file, // direct url to JSON menu cache file if !menu_cache_validate
      'start_path' => $this->start_path, // assign calculated start_path for first JS load
      'query_path_invalid' => $this->start_path && !$this->absolute_start_path, // invalid query path forward to JS
      'dirs' => $this->dirs, // preload dirs array for Javascript, will be served as json
      'dirs_hash' => U::dirs_hash(), // dirs_hash to manage JS localStorage
      'resize_image_types' => U::resize_image_types(), // let JS know what image types can be resized
      'image_cache_hash' => $this->get_image_cache_hash(), // image cache hash to prevent expired cached/proxy images
      'image_resize_dimensions_retina' => U::image_resize_dimensions_retina(), // calculated retina
      'location_hash' => md5(Config::$root), // so JS can assume localStorage for relative paths like menu items open
      'is_logged_in' => Config::$is_logged_in, // for login/logout interface
      'session_token' => isset($_SESSION['token']) ? $_SESSION['token'] : false, // if token is set, there is login (logged in or not)
      'version' => Config::$version, // forward version to JS
      'index_html' => intval(U::get('index_html')), // popuplated when index.html is published by plugins/files.tasks.php
      'server_exif' => function_exists('exif_read_data'), // so images can be oriented from exif orientation if detected
      'image_resize_memory_limit' => $this->get_image_resize_memory_limit(), // so JS can calculate what images can be resized
      'md5' => $this->get_md5('6c6963656e73655f6b6579'), // calculate md5 hash
      'video_thumbs_enabled' => !!U::ffmpeg_path(), // so JS can attempt to load video preview images
      'pdf_thumbs_enabled' => !!U::imagemagick_path(), // so JS can attempt to load PDF preview images
      'lang_custom' => $this->lang_custom(), // get custom language files _files/lang/*.json
      'x3_path' => X3::x3_path(), // in case of used with X3, forward X3 url path for thumbnails
      'userx' => isset($_SERVER['USERX']) ? $_SERVER['USERX'] : false, // forward USERX from server (if set)
      'assets' => U::assetspath(), // calculated assets path (Javascript and CSS files from CDN or local)
      'watermark_files' => $this->get_watermark_files(), // get uploaded watermark files (font, image) from _files/watermark/*
      'ZipArchive_enabled' => class_exists('ZipArchive'), // required for zip and unzip functions on server
      'upload_max_filesize' => $this->get_upload_max_filesize(), // let the upload interface know upload_max_filesize
    ]);
  }

  // get image cache hash from settings, used by JS when loading images, to prevent expired images from being served by cache/proxy
  private function get_image_cache_hash(){
    if(!Config::get('load_images')) return false; // exit
    return substr(md5(Config::$document_root . Config::$root . Config::get('image_resize_function') . Config::get('image_resize_quality')), 0, 6);
  }

  // get image resize memory_limit so JS can calculate at what dimensions images can be resized
  private function get_image_resize_memory_limit(){
    if(!function_exists('ini_set')) return U::get_memory_limit_mb();
    return (int) max(U::get_memory_limit_mb(), Config::get('image_resize_memory_limit'));
  }

  // calculate md5 hash from string
  private function get_md5($str){
    $str = Config::get(hex2bin($str));
    return $str ? md5($str) : false;
  }

  // look for custom language files in _files/lang/*.json and forward to Javascript
  private function lang_custom() {
    if(!Config::$storagepath) return false;
    $dir = Config::$storagepath . '/lang'; // custom languages path
    $files = is_dir($dir) ? glob($dir . '/*.json') : false; // get language json files
    if(empty($files)) return false; // exit
    $langs = []; // start languages array
    foreach ($files as $path) { // loop language files
      $json = @file_get_contents($path);
      $data = !empty($json) ? @json_decode($json, true) : false;
      if(!empty($data)) $langs[strtok(U::basename($path), '.')] = $data; // assign language as array
    }
    return !empty($langs) ? $langs : false; // return array of languages with values
  }

  // search for watermark files (font, image) in _files/watermark/* for Uppy Compressor
  private function get_watermark_files() {
    if(!Config::get('allow_upload') || !Config::$storagepath || !Path::is_within_docroot(Config::$storagepath)) return false;
    $dir = Config::$storagepath . '/watermark'; // _files/watermark
    if(!file_exists($dir) || !is_readable($dir)) return false; // exit
    $files = @glob($dir . '/*', GLOB_NOSORT); // get files in _files/watermark/*
    return array_filter(array_map(function($file){
      return Path::urlpath($file); // map results to relative url's loadable from Javascript
    }, $files ?: [])); // default to empty array [] just in case there was some error
  }

  // get upload_max_filesize for uploader interface, limited by PHP upload_max_filesize, post_max_size and config upload_max_filesize
  private function get_upload_max_filesize(){
    if(!Config::get('allow_upload')) return 0; // just return 0 if upload is disabled
    $arr = array_filter([U::ini_value_to_bytes('upload_max_filesize'), U::ini_value_to_bytes('post_max_size'), Config::get('upload_max_filesize')]); // don't include falsy values
    return empty($arr) ? 0 : min($arr);
  }
}



/* Files Gallery application logic starts here */

// set UTF-8 locale so that basename() and other string functions work correctly with multi-byte strings.
setlocale(LC_ALL, 'en_US.UTF-8');

// start new Config()
new Config();

// process actions ?action=
if(U::get('action')){

  // start new request
  $request = new Request();

  // action shortcut
  $action = $request->action;

  // only allow valid actions
  if(!in_array($action, ['login', 'files', 'dirs', 'load_text_file', 'check_updates', 'do_update', 'save_license', 'delete', 'text_edit', 'unzip', 'rename', 'new_file', 'new_folder', 'zip', 'copy', 'move', 'duplicate', 'get_downloadables', 'upload', 'download_dir_zip', 'preview', 'file', 'download', 'tasks', 'tests'])) $request->error("Invalid action '$action'");

  // check that request method matches action, so we can't make POST requests from GET / this should be improved
  if($request->is_post === in_array($action, ['download_dir_zip', 'preview', 'file', 'download', 'tasks', 'tests'])) $request->error("Invalid request method {$_SERVER['REQUEST_METHOD']} for action=$action");

  // check if actions with config allow_{$ACTION} (most write actions) are allowed
  if(!$request->action_allowed()) $request->error("$action not allowed");

  // block all write actions in demo mode (that's what demo_mode option is for)
  if(Config::get('demo_mode') && in_array($action, ['upload', 'delete', 'rename', 'new_folder', 'new_file', 'duplicate', 'text_edit', 'zip', 'unzip', 'move', 'copy'])) $request->error("$action not allowed in demo mode");

  // block all download actions [get_downloadables, download_dir_zip, download] if !allow_download
  if(!Config::get('allow_download') && strpos($action, 'download') !== false) $request->error('Download not allowed');

  // block all mass download actions [get_downloadables, download_dir_zip] if !allow_mass_download
  if(!Config::get('allow_mass_download') && in_array($action, ['get_downloadables', 'download_dir_zip'])) $request->error('Mass download not allowed');

  // prepare and validate $dir (full) from ?file parameter (if isset) for various actions
  $dir = $request->param('dir');
  if($dir !== false){ // explicitly check !== false because $dir could be valid '' empty (root)
    $dir = Path::valid_rootpath($dir, true);
    if(!$dir) $request->error('Invalid dir path');
    // some actions require $dir to be writeable
    if(in_array($action, ['copy', 'move', 'unzip', 'upload']) && !is_writable($dir)) $request->error('Dir is not writeable');
  // actions that strictly require $dir (it's optional for some actions)
  } else if(in_array($action, ['files', 'copy', 'move', 'upload', 'download_dir_zip', 'preview'])){
    $request->error('Missing dir parameter');
  }

  // prepare and validate $file (full) from ?file parameter (if isset) for various actions
  $file = $request->param('file');
  if($file){
    $file = Path::valid_rootpath($file);
    if(!$file) $request->error('Invalid file path');
  // actions that strictly require $file
  } else if(in_array($action, ['load_text_file', 'file', 'download'])){
    $request->error('Missing file parameter');
  }

  // validate items for Filemanager actions (all but upload)
  if(isset($request->params['items'])){

    // assign $items
    $items = $request->params['items'];

    // invalid $items if false, empty array or !array
    if(empty($items) || !is_array($items)) $request->error('Invalid items parameter');

    // assign [paths] / make sure each item.path exists, is valid, not excluded, and relative to Config::$root
    $paths = array_values(array_filter(array_map(function($item){
      return Path::valid_rootpath($item['path'], $item['is_dir']);
    }, $items)));

    // no valid item paths
    if(empty($paths)) $request->error('Invalid item paths');

    // shortcut because many actions only apply to a single item
    $first_path = reset($paths);

    // only actions new_file and new_file are allowed on root dir / other actions don't make sense for root
    if($first_path === Config::$root && !in_array($action, ['new_file', 'new_folder'])) $request->error("Can't $action root directory");

    // prepare $new_path for actions rename (required), new_file, new_folder, zip and duplicate
    $new_path = false; // instantiate var because it's optional for all actions except rename
    $name = $request->param('name'); // get ?name parameter
    if($name !== false) {

      // check if $name is allowed
      if(!Filemanager::name_is_allowed($name)) $request->error(trim("Invalid name $name"));

      // get parent dir / if new_folder or new_file, use selected item path, else dirname() of selected item path
      $parent_dir = in_array($action, ['new_folder', 'new_file']) ? $first_path : dirname($first_path);
      if(!is_dir($parent_dir)) $request->error('Not a directory'); // parent path must be dir
      if(!is_writable($parent_dir)) $request->error('Dir is not writeable'); // dir must be writeable

      // assign $new_path from $name
      $new_path = $parent_dir . '/' . $name;
      if(file_exists($new_path)) $request->error((is_dir($new_path) ? 'Dir' : 'File') . ' already exists');
    }

  // actions that require items parameter
  } else if(in_array($action, ['copy', 'delete', 'duplicate', 'get_downloadables', 'move', 'new_file', 'new_folder', 'rename', 'text_edit', 'unzip', 'zip'])){
    $request->error('Missing items parameter');
  }

  /* ACTIONS */

  // get files from dir_target
  if($action === 'files') {

    // output dir array in json format (checks json cache first)
    (new Dir($dir))->json();

  // get dirs for menu
  } else if($action=== 'dirs'){
    new Dirs();

  // read text file
  } else if($action === 'load_text_file'){
    header('content-type: text/plain; charset=UTF-8');
    if(@readfile($file) === false) U::error('failed to read file', 500);

  // check Files Gallery updates JSON file from jsdelivr.com repository
  } else if($action === 'check_updates'){
    $json = @json_decode(@file_get_contents('https://data.jsdelivr.com/v1/package/npm/files.photo.gallery'), true);
    $latest = !empty($json) && isset($json['versions'][0]) && version_compare($json['versions'][0], Config::$version) > 0 ? $json['versions'][0] : false;
    Json::jexit([
      'success' => $latest,
      'writeable' => $latest && is_writable(__FILE__) // only check if __FILE__ is writeable if $latest
    ]);

  // attempt to update Files Gallery index.php to latest version via remote repository jsdelivr.com
  } else if($action === 'do_update'){
    // various requirements, which would normally be satisfied if accessed from the interface
    $version = $request->param('version');
    if(!$version || !Config::get('allow_check_updates') || version_compare($version, Config::$version) <= 0 || !is_writable(__FILE__)) $request->error('Error');
    $get = @file_get_contents('https://cdn.jsdelivr.net/npm/files.photo.gallery@' . $version . '/index.php');
    if(empty($get) || strpos($get, '<?php') !== 0 || !@file_put_contents(__FILE__, $get)) Json::error('failed to update');
    Json::jexit(['success' => true]);

  // save input license key to user config
  } else if($action === 'save_license'){
    $key = $request->param('key');
    Json::jexit([
      'success' => $key && Config::$storageconfigpath && Config::save(['license_key' => $key]),
      'md5' => $key ? md5($key) : false
    ]);

  // delete items
  } else if($action === 'delete') {
    Filemanager::json(Filemanager::items('delete', $paths), 'failed to delete items');

  // text_edit write to file
  } else if($action === 'text_edit'){
    if(!isset($request->params['text']) || !is_string($request->params['text'])) $request->error('Invalid text parameter');
    if(!is_writeable($first_path)) $request->error('File is not writeable');
    if(!is_file($first_path)) $request->error('Not a file');
    if(@file_put_contents($first_path, $request->params['text']) === false) $request->error('failed to write to file', 500);
    @touch(dirname($first_path)); // invalidate cache by updating parent dir mtime
    Filemanager::json(true, 'failed to write to file');

  // unzip zip file
  } else if($action === 'unzip'){

    // extract single zip file to $dir / if !$dir, it uses zip file parent
    Filemanager::json((new Zipper(true))->extract($first_path, $dir), 'Failed to extract zip file');

  // rename
  } else if($action === 'rename'){

    // new_path (derrved from $name) is required for rename action
    if(!$new_path) $request->error('Missing name parameter');

    // attempt to rename single file
    Filemanager::json(@rename($first_path, $new_path), 'Rename failed');

  // new_file
  } else if($action === 'new_file'){

    // attempt to create new file from $new_path or assign unique incremental filename "untitled-file.txt"
    Filemanager::json(@touch($new_path?:Filemanager::get_unique_filename($first_path . '/untitled-file.txt')), 'Create new file failed');

  // new_folder
  } else if($action === 'new_folder'){

    // attempt to create new directory from $new_path or assign unique incremental folder name from "untitled-folder"
    Filemanager::json(@mkdir($new_path?:Filemanager::get_unique_filename($first_path . '/untitled-folder')), 'Create new folder failed');

  // zip items / $new_path is optional, will create auto-named zip in current dir if empty
  } else if($action === 'zip') {
    Filemanager::json((new Zipper(true))->create($paths, $new_path), 'Failed to zip items');

  // copy or move use identical pre-process
  } else if(in_array($action, ['copy', 'move'])) {

    // don't allow copy/move items over themselves copy/move dirs into themselves (may cause infinite recursion)
    // this is already blocked in copy function, but better detect up front for items array and respond appropriately
    $valid_copy_move_paths = array_filter($paths, function($path) use ($dir){
      return !Path::is_within_path($dir . '/' . U::basename($path), $path);
    });

    // can't copy/move into self error
    if(empty($valid_copy_move_paths)) $request->error("can't $action into self");

    // response
    Filemanager::json(Filemanager::items($action, $valid_copy_move_paths, $dir), $action . ' failed');

  // duplicate / really just a shortcut for copy into same dir
  } else if($action === 'duplicate') {

    // duplicates a single item with provided $name (pre-assigned to $new_path)
    if($new_path) Filemanager::json(Filemanager::copy($first_path, $new_path), 'duplicate failed');

    // duplicates an array of files and dirs, automatically incrementing file names
    Filemanager::json(Filemanager::items('duplicate', $paths), 'duplicate failed');

  // get_downloadables returns an array of downloadable files recursively from an array of directories
  } else if($action === 'get_downloadables'){

    // return an array of downloadable files from within an array of $paths
    Json::jexit(Filemanager::get_downloadables($paths));

  // upload
  } else if($action === 'upload'){

    // get $_FILES['file'] array
    $upload = isset($_FILES) && isset($_FILES['file']) && is_array($_FILES['file']) ? $_FILES['file'] : false;

    // invalid $_FILES['file']
    if(empty($upload) || !isset($upload['error']) || is_array($upload['error'])) $request->error('Invalid $_FILES[]');

    // PHP meaningful file upload errors / https://www.php.net/manual/en/features.file-upload.errors.php
    if($upload['error'] !== 0) {
      $upload_errors = [
        1 => 'Uploaded file exceeds upload_max_filesize directive in php.ini',
        2 => 'Uploaded file exceeds MAX_FILE_SIZE directive specified in the HTML form',
        3 => 'The uploaded file was only partially uploaded',
        4 => 'No file was uploaded',
        6 => 'Missing a temporary folder',
        7 => 'Failed to write file to disk.',
        8 => 'A PHP extension stopped the file upload.'
      ];
      $request->error(isset($upload_errors[$upload['error']]) ? $upload_errors[$upload['error']] : 'unknown error');
    }

    // invalid $upload['size']
    if(!isset($upload['size']) || empty($upload['size'])) $request->error('Invalid file size');

    // $upload['size'] must not exceed $config['upload_max_filesize']
    if(Config::get('upload_max_filesize') && $upload['size'] > Config::get('upload_max_filesize')) $request->error('File size [' . $upload['size'] . '] exceeds upload_max_filesize option [' . Config::get('upload_max_filesize') . ']');

    // get filename
    $filename = $upload['name'];

    // for security reasons, slashes are never allowed in file names
    if(strpos($filename, '/') !== false || strpos($filename, '\\') !== false) $request->error('Illegal \slash/ in filename ' . $filename);

    // get allowed_file_types / 'image/*, .pdf, .mp4'
    $allowed_file_types = Config::get('upload_allowed_file_types') ? array_filter(array_map('trim', explode(',', Config::get('upload_allowed_file_types')))) : false;

    // check allowed_file_types
    if(!empty($allowed_file_types)){
      $mime = U::mime($upload['tmp_name']) ?: $upload['type']; // mime from PHP or upload[type]
      $ext = U::extension($filename, true, true); // get extension lowercase starting with .dot
      $is_valid = false; // default !is_valid until validated
      // check if extension match || wildcard match mime type image/*
      foreach ($allowed_file_types as $allowed_file_type) if($ext === ('.' . ltrim($allowed_file_type, '.')) || fnmatch($allowed_file_type, $mime)) {
        $is_valid = true;
        break;
      }

      // invalid file type
      if(!$is_valid) $request->error("Invalid file type $filename");

      // for additional security, check if uploaded image is an actual image with exif_imagetype() function
      if(function_exists('exif_imagetype') && in_array($ext, ['.gif', '.jpeg', '.jpg', '.png', '.swf', '.psd', '.bmp', '.tif', '.tiff', '.webp', '.avif']) && !@exif_imagetype($upload['tmp_name'])) $request->error("Invalid image type $filename");
    }

    // create subdirs when relativePath exists (keeps folder structure from drag and drop)
    $relative_path = $request->param('relativePath');
    if(!empty($relative_path) && $relative_path != 'null' && $relative_path != $filename && strpos($relative_path, '/') !== false){
      $new_dir = dirname("$dir/$relative_path");
      if(file_exists($new_dir) || @mkdir($new_dir, 0777, true)) $dir = $new_dir;
    }

    // assign move to path
    $move_path = "$dir/$filename";

    // fail if config upload_exists === false
    if(Config::get('upload_exists') === 'fail' && file_exists($move_path)) $request->error("$filename already exists");

    // increment file name if file name already exists
    if(Config::get('upload_exists') === 'increment') $move_path = Filemanager::get_unique_filename($move_path);

    // all is well! attempt to move_uploaded_file() / JSON RESPONSE
    Filemanager::json([
      'success' => @move_uploaded_file($upload['tmp_name'], $move_path),
      'filename' => $filename, // return filename in case it was incremented or renamed
      'url' => Path::rooturlpath(Path::relpath($move_path)), // for usage with showLinkToFileUploadResult
    ], 'failed to move_uploaded_file()');

  // $_GET download_dir_zip / download files in directory as zip file
  } else if($action === 'download_dir_zip'){

    // check download_dir enabled
    if(Config::get('download_dir') !== 'zip') $request->error('download_dir zip disabled');

    // create zip cache directly in dir (recommended, so that dir can be renamed while zip cache remains)
    if(!Config::$storagepath || Config::get('download_dir_cache') === 'dir') {
      if(!is_writable($dir)) $request->error('Dir is not writeable', 500);
      $zip_file_name = '_files.zip';
      $zip_file = $dir . '/' . $zip_file_name;

    // create zip file in storage _files/zip/$dirname.$md5.zip /
    } else {
      U::mkdir(Config::$storagepath . '/zip');
      $zip_file_name = U::basename($dir) . '.' . substr(md5($dir), 0, 6) . '.zip';
      $zip_file = Config::$storagepath . '/zip/' . $zip_file_name;
    }

    // cached / download_dir_cache && file_exists() && zip is not older than dir time
    $cached = Config::get('download_dir_cache') && file_exists($zip_file) && filemtime($zip_file) >= filemtime($dir);

    // create zip if !cached
    if(!$cached && !(new Zipper())->create([$dir], $zip_file)) $request->error('Failed to create ZIP file', 500);

    // ignore user abort so we can delete file also on download cancel
    if(!Config::get('download_dir_cache')) @ignore_user_abort(true);

    // output zip file as download using correct headers and readfile()
    U::download($zip_file, $zip_file_name . ($cached ? ' cached' : ' created'), 'application/zip', U::basename($dir) . '.zip');

    // delete temporary zip file if cache disabled
    if(!Config::get('download_dir_cache')) @unlink($zip_file);

  // $_GET folder preview from images/video inside dir
  } else if($action === 'preview'){

    // allow folder preview image only if folder_preview_image, load_images, image_resize_enabled and cache
    foreach (['folder_preview_image', 'load_images', 'image_resize_enabled', 'image_resize_cache'] as $key) if(!Config::get($key)) $request->error("Config option $key disabled", 403);

    // 1. first check if default folder_preview_default '_filespreview.jpg' exists in dir / must be resized
    $default = Config::get('folder_preview_default') ? $dir . '/' . Config::get('folder_preview_default') : false;
    if($default && file_exists($default)) {
      U::message(Config::get('folder_preview_default'));
      new ResizeImage($default, Config::get('image_resize_dimensions')); // default resize for small preview images
    }

    // 2. assign cache path
    $cache = Config::$cachepath . '/images/preview.' . substr(md5($dir), 0, 6) . '.jpg';

    // check if preview cache file exists / _files/cache/images/preview.HASH.jpg
    if(file_exists($cache)) {

      // make sure cache file is valid (must be newer than dir updated time)
      if(filemtime($cache) >= filemtime($dir)) U::readfile($cache, 'image/jpeg', 'Preview image from cache', true);

      // delete expired cache file if is older than dir updated time [silent]
      @unlink($cache);
    }

    // 3. glob files to look for images and video
    $files = U::glob("$dir/*");

    // files found
    if(!empty($files)) {

      // prepare arrays of supported image and video formats
      $image_types = U::resize_image_types();
      $video_types = U::ffmpeg_path() ? ['mp4', 'm4v', 'm4p', 'webm', 'ogv', 'mkv', 'avi', 'mov', 'wmv'] : [];

      // loop files to locate first match
      foreach ($files as $file) {

        // get extension lowercase
        $ext = U::extension($file, true);
        if(empty($ext)) continue; // skip if no extension

        // match image or video, return target resize_dimensions if image
        $match = in_array($ext, $image_types) ? Config::get('image_resize_dimensions') : (in_array($ext, $video_types) ? 'video' : false);
        if(!$match) continue; // skip if extension not supported

        // skip if is_exclude or !readable
        if(Path::is_exclude($file, false) || !is_readable($file)) continue;

        // get preview image or video, and clone into preview $cache for faster access on next request for dir
        new FileResponse($file, $match, $cache);
        break; exit; // just in case, although new FileResponse() will exit on U::readfile()
      }
    }

    // 4. nothing found (no images in dir)
    // create empty 1px in $cache, and output (so next check knows dir is empty or has no images, unless updated)
    if(imagejpeg(imagecreate(1, 1), $cache)) U::readfile($cache, 'image/jpeg', '1px placeholder image created and cached', true);

  // $_GET file / resize parameter for preview images, else will proxy any file
  } else if($action === 'file'){
    new FileResponse($file, U::get('resize'));

  // $_GET force download single file by PHP
  } else if($action === 'download'){

    // output file as download using correct headers and readfile()
    U::download($file, 'Download ' . U::basename($file), U::mime($file) ?: 'application/octet-stream', U::basename($file));

  // $_GET tasks plugin (for pre-caching or clearing cache, not official plugin yet ...)
  } else if($action === 'tasks'){
    if(!U::uinclude('plugins/files.tasks.php')) $request->error('Can\'t find tasks plugin', 404);

  // login from within Files Gallery with fetch() return json success
  } else if($action === 'login'){
    Json::jexit(['success' => true]);

  // output PHP and server features by url ?action=tests / for diagnostics only
  } else if($action === 'tests'){
    new Tests();

  // invalid action 400
  } else {
    $request->error("Invalid action $action");
  }

// output main Files Gallery document html if !action
} else {
  new Document();
}

// THE END!
