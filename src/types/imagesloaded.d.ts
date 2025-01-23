declare module "imagesloaded" {
  function imagesLoaded(
    element: Element | NodeList | string,
    callback?: (instance: any) => void
  ): void;

  namespace imagesLoaded {
    // You can add more specific type definitions if needed
  }

  export default imagesLoaded;
}
