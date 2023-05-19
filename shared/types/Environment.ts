import browserSync from 'browser-sync'

export interface Environment {
  /**
   * Specifies the root directory of the entire project.
   * Used in defining all possible paths in scripts.
   */
  root: string

  /**
   *
   */
  publicUrl: string

  /**
   * Defines a path relative to the project root that will
   * store all the project source files and that will take
   * part in constructing complete paths for them.
   */
  sourceDir: string

  /**
   * Specifies the output path of the build artifacts relative
   * to the project root.
   */
  outputDir: string

  /**
   * Specifies the dev server options.
   */
  devserver: browserSync.Options

  /**
   *
   */
  components: {
    /**
     *
     */
    sourceDir: string

    /**
     *
     */
    configDir: string

    /**
     *
     */
    configFile: string
  }

  /**
   * Defines settings for processing html/pug files.
   */
  html: {
    /**
     * Defines a directory path that will store all the project
     * pages.
     */
    sourceDir: string

    /**
     * Specifies the output path of the html build artifacts
     * relative to the project root.
     */
    outputDir: string
  }

  /**
   * Defines settings for processing css/sass/scss files.
   */
  styles: {
    /**
     * Specifies the path to the directory where all global style
     * files will be stored.
     * Note: page files and library files are not included and
     * are specified separately.
     */
    sourceDir: string

    /**
     * Specifies the path to the directory where the style files
     * for the pages will be stored.
     */
    sourcePagesDir: string

    /**
     * Specifies the output path for artifacts that come out of
     * the global styles assembly.
     */
    outputDir: string

    /**
     * Specifies the output path for artifacts that come out of
     * the css assembly for each page.
     */
    outputPagesDir: string
  }

  /**
   * Defines settings for processing js files.
   */
  scripts: {
    /**
     * Specifies the path to the directory where all global scripts
     * will be stored.
     * Note: page scripts and library scripts are not included and
     * are specified separately.
     */
    sourceDir: string

    /**
     * Specifies the path to the directory where the scripts for
     * the pages will be stored.
     */
    sourcePagesDir: string

    /**
     * Specifies the path to the directory where the library scripts
     * will be stored.
     */
    sourceVendorDir: string

    /**
     * Specifies the output path for artifacts that come out of
     * the global scripts assembly.
     */
    outputDir: string

    /**
     * Specifies the output path for artifacts that come out of
     * the scripts assembly for each page.
     */
    outputPagesDir: string

    /**
     * Specifies the output path for artifacts that come out of
     * the scripts assembly for libraries.
     */
    outputVendorDir: string
  }

  /**
   * Defines settings for processing images.
   */
  images: {
    /**
     * Defines a directory path that will store images.
     */
    sourceDir: string

    /**
     * Specifies the output path of the images build artifacts.
     */
    outputDir: string
  }

  /**
   * Defines settings for font processing.
   */
  fonts: {
    /**
     * Defines a directory path that will fonts store.
     */
    sourceDir: string

    /**
     * Specifies the output path of the fonts build artifacts.
     */
    outputDir: string
  }

  /**
   * Defines settings for sprite processing.
   */
  sprite: {
    /**
     * Defines sprite filename.
     */
    filename: string

    /**
     * Defines a directory path that will store sprite icons.
     */
    sourceDir: string

    /**
     * Specifies the output path of the sprite build artifacts.
     */
    outputDir: string
  }

  /**
   * Defines settings for favicon processing.
   */
  favicon: {
    /**
     * Defines a directory path that will store favicon assets.
     */
    sourceDir: string

    /**
     * Specifies the output path of the favicon build artifacts.
     */
    outputDir: string
  }
}
