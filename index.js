(function (pie) {

  pie.addFramework('react', {

    /**
     * @param name 
     * @param Component 
     * @return CustomElementPrototype 
     */
    definePrototype: function (name, ReactComponent) {

      function create(nativeElement) {

        if (
          nativeElement.__model &&
          nativeElement.__session) {

          var element = React.createElement(ReactComponent, {
            model: nativeElement.__question.model,
            session: nativeElement.__session
          });

          nativeElement.reactiveElement = element;
          return ReactDOM.render(element, nativeElement, function () { });
        }
      }

      var elementPrototype = Object.create(HTMLElement.prototype);

      elementPrototype.isPieReactElement = true;

      function defineProperty(name, opts) {
        var reserved = '__' + name;
        opts = opts || {};
        Object.defineProperty(elementPrototype, name, {
          get: function () {
            if (opts.get) {
              return opts.get(this[reserved]);
            } else {
              return this[reserved];
            }
          },
          set: function (d) {
            this[reserved] = d;
            if (opts.set) {
              opts.set.bind(this)(this[reserved])
            }
          }
        });
      }

      var propOpts = {
        set: function () {
          create(this);
        }
      };

      defineProperty('session', propOpts);
      defineProperty('model', propOpts);

      elementPrototype.createdCallback = function () { };
      return elementPrototype;
    }
  });

})(pie);
