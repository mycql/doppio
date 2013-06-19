// Generated by CoffeeScript 1.6.2
(function() {
  var description, min_width, options, print_col, root, show_help, _;

  _ = require('../vendor/_.js');

  root = typeof exports !== "undefined" && exports !== null ? exports : this.option_parser = {};

  options = null;

  description = null;

  root.describe = function(new_description) {
    var category, category_copy, k, opt_name, opt_value;

    options = {};
    description = new_description;
    for (k in description) {
      category = description[k];
      category_copy = {};
      for (opt_name in category) {
        opt_value = category[opt_name];
        if (_.isString(opt_value)) {
          opt_value = category[opt_name] = {
            description: opt_value
          };
        }
        category_copy[opt_name] = opt_value;
        if (opt_value.alias != null) {
          opt_value.aliased_by = opt_name;
          category_copy[opt_value.alias] = opt_value;
        }
      }
      options[k] = category_copy;
    }
  };

  root.parse = function(argv) {
    var arg, args, key, parse_flag, prop, result, value, _ref;

    args = argv.slice(2).reverse();
    result = {
      standard: {},
      non_standard: {},
      properties: {},
      _: []
    };
    parse_flag = function(args, full_key, key, option_data, result_dict) {
      var _ref;

      if (!option_data[key]) {
        console.error("Unrecognized option '" + full_key + "'");
        process.exit(1);
      }
      result_dict[(_ref = option_data[key].aliased_by) != null ? _ref : key] = option_data[key].has_value ? args.pop() : true;
      return args;
    };
    while (args.length > 0) {
      arg = args.pop();
      if (arg[0] !== '-' || (result.standard.jar != null)) {
        result._ = args.reverse();
        if (result.standard.jar != null) {
          result._.unshift(arg);
        } else {
          result.className = arg;
        }
        break;
      }
      if (arg.length <= 2) {
        args = parse_flag(args, arg, arg.slice(1), options.standard, result.standard);
      } else {
        switch (arg[1]) {
          case 'X':
            args = parse_flag(args, arg, arg.slice(2), options.non_standard, result.non_standard);
            break;
          case 'D':
            prop = arg.slice(2);
            _ref = prop.split('='), key = _ref[0], value = _ref[1];
            result.properties[key] = value != null ? value : true;
            break;
          default:
            args = parse_flag(args, arg, arg.slice(1), options.standard, result.standard);
        }
      }
    }
    return result;
  };

  min_width = function(values) {
    var value;

    return Math.max.apply(Math, (function() {
      var _i, _len, _results;

      _results = [];
      for (_i = 0, _len = values.length; _i < _len; _i++) {
        value = values[_i];
        _results.push(value.length);
      }
      return _results;
    })());
  };

  print_col = function(value, width) {
    var padding, rv;

    rv = value;
    padding = width - value.length;
    while (padding-- > 0) {
      rv += " ";
    }
    return rv;
  };

  show_help = function(description, prefix) {
    var combined_keys, key, key_col_width, keys, opt, option, rv;

    rv = "";
    combined_keys = {};
    for (key in description) {
      opt = description[key];
      keys = [key];
      if (opt.alias != null) {
        keys.push(opt.alias);
      }
      combined_keys[((function() {
        var _i, _len, _results;

        _results = [];
        for (_i = 0, _len = keys.length; _i < _len; _i++) {
          key = keys[_i];
          _results.push("-" + prefix + key);
        }
        return _results;
      })()).join(', ')] = opt;
    }
    key_col_width = min_width((function() {
      var _results;

      _results = [];
      for (key in combined_keys) {
        opt = combined_keys[key];
        _results.push(key);
      }
      return _results;
    })());
    for (key in combined_keys) {
      option = combined_keys[key];
      rv += "" + (print_col(key, key_col_width)) + "    " + option.description + "\n";
    }
    return rv;
  };

  root.show_help = function() {
    return show_help(description.standard, '');
  };

  root.show_non_standard_help = function() {
    return show_help(description.non_standard, 'X');
  };

}).call(this);
