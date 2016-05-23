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
          nativeElement.__question && 
          nativeElement.__session && 
          nativeElement.__env) {
            
          nativeElement.__outcome = nativeElement.__outcome || {};
          
          var element = React.createElement(ReactComponent, {
            model: nativeElement.__question.model,
            session: nativeElement.__session,
            env: nativeElement.__env,
            outcome: nativeElement.__outcome
          });

          nativeElement.reactiveElement = element;
          return ReactDOM.render(element, nativeElement, function () {
            // console.log('rendered!', arguments);
          });
        }
      }

      var elementPrototype = Object.create(HTMLElement.prototype);

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
      }
      
      defineProperty('env', propOpts); 
      defineProperty('session', propOpts); 
      defineProperty('question', propOpts); 
      defineProperty('outcome', propOpts); 

      elementPrototype.createdCallback = function () {
        // var event = new CustomEvent('pie.register', { bubbles: true });
        // this.dispatchEvent(event);
      };

      return elementPrototype;
    }
  });

})(pie);
