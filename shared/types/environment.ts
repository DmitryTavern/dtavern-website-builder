export interface Environment {
  /**
   * Specifies the root directory of the entire project.
   * Used in defining all possible paths in scripts.
   */
  root: string

  /**
   * Defines a path relative to the project root that will
   * store all the project source files and that will take
   * part in constructing complete paths for them.
   */
  sourceDir: string

  /**
   * Defines project build settings.
   */
  build: {
    /**
     * Specifies the output path of the build artifacts relative
     * to the project root.
     */
    outputDir: string
  }
}
