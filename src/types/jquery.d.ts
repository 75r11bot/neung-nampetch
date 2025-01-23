interface JQueryStatic {
  animateNumber: {
    numberStepFactories: {
      separator: (separator: string) => (now: any, tween: any) => void;
    };
  };
}

// Extend JQuery to include methods from plugins
interface JQuery {
  owlCarousel(options?: any): JQuery;
  waypoint(handler: (direction: string) => void, options?: any): JQuery;
  isotope(options?: any): JQuery;
  jarallax(options?: any): JQuery;
  animateNumber(options?: any): JQuery;
  imagesLoaded(callback?: any): JQuery;
  progress(callback?: any): JQuery;
}
