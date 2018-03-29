// example function where arguments 2 and 3 are optional
function example( err, optionalA, optionalB, callback ) {

    // retrieve arguments as array
    var args = [];
    for (var i = 0; i < arguments.length; i++) {
        args.push(arguments[i]);
    }

    // first argument is the error object
    // shift() removes the first item from the
    // array and returns it
    err = args.shift();

    // last argument is the callback function.
    // pop() removes the last item in the array
    // and returns it
    callback = args.pop();

    // if args still holds items, these are
    // your optional items which you could
    // retrieve one by one like this:
    if (args.length > 0) optionalA = args.shift(); else optionalA = null;
    if (args.length > 0) optionalB = args.shift(); else optionalB = null;

    // continue as usual: check for errors
    if (err) return callback(err);

    // for tutorial purposes, log the optional parameters
    console.log('optionalA:', optionalA);
    console.log('optionalB:', optionalB);

    /* do your thing */

} // example()


// invoke example function with and without optional arguments

example(null, function (err) {   /* do something */    });

example(null, 'AA', function (err) {});

example(null, 'AAAA', 'BBBB', function (err) {});
