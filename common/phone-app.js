/**
 * Base class to build M-Phone apps.  
 * 
 * Methods to override:  
 * build()  
 * postBuild()  
 * launch()  
 * sleep()  
 * requiredVersion()
 */
class PhoneApp {

  constructor(name, iconUrl) {
    this._name = name;
    this._iconUrl = iconUrl;
  }

  /**
   * The function which will build the app.  
   * This has to be overridden and called from the subclass (custom phone app).  
   * The overridden method will add the actual componenets and elements to the app.  
   * The first line of the overridden method must always be super.build()  
   */
  build() {
    this._appRoot = document.createElement('div');
    this._appRoot.style.width = '100%';
    this._appRoot.style.height = '100%';
    this._appRoot.style.backgroundColor = 'grey';
    this._appRoot.style.overflowY = 'auto';
    this._appRoot.style.overflowX = 'auto';
  }

  /**
   * This is where all the events are defined and registered.  
   * This method gets called after the build is done. So if we have a button (which has been 
   * defined in build() method), this is where the behaviour when it is clicked will be 
   * defined.
   */
  postBuild() {}

  /**
   * Anthing that needs to be done at launch, needs to go here. Example, call a rest endpoint 
   * to fetch some data...  
   * The last line of the overridden method must always be return super.launch()  
   * @returns 
   */
  launch() {
    return this._appRoot;
  }

  /**
   * Anthing that needs to be done at app switch, needs to go here. Example notify an event to 
   * I don't know, maybe stop collecting app data
   */
  sleep() {}
  
  /**
   * Utility method to apply a style to an element
   * @param {*} element to style
   * @param {*} style to apply
   */
  css(element, style) {
    for (const property in style)
        element.style[property] = style[property];
  }

  /**
   * Needs to be overriden for any app which requires phone version greater than 1
   */
  requiredVersion() {
    return 1;
  }

}