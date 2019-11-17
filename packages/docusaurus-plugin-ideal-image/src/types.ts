export interface PluginOptions {
  /**
   * Filename template for output files.
   */
  name?: string;
  /**
   * Specify all widths you want to use; if a specified size exceeds the original image's width, the latter will be used (i.e. images won't be scaled up). You may also declare a default sizes array in the loader options in your webpack.config.js.
   */
  sizes?: number[];
  /**
   * Specify one width you want to use; if the specified size exceeds the original image's width, the latter will be used (i.e. images won't be scaled up)
   */
  size?: number;
  /**
   * As an alternative to manually specifying sizes, you can specify min, max and steps, and the sizes will be generated for you.
   */
  min?: number;
  /**
   * See min above
   */
  max?: number;
  /**
   * Configure the number of images generated between min and max (inclusive)
   */
  steps?: number;
  /**
   * JPEG compression quality
   */
  quality?: number;
}

export interface ImageProps extends React.ImgHTMLAttributes<{}> {
  img: any;
}
