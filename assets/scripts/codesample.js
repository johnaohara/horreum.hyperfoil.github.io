function insertCodesample(where, tag, src, slice) {
    var pre = document.createElement('pre');
    pre.className = "highlight";
    var code = document.createElement('code');
    code.className = "prettyprint";
    code.id = (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    pre.insertBefore(code, null);
    where.parentNode.insertBefore(pre, document.currentScript)
    fetch('https://raw.githubusercontent.com/Hyperfoil/Hyperfoil/' + tag + '/' + src , { cache: "reload"})
      .then(function(response) {
          if (!response.ok) {
              fetch('https://raw.githubusercontent.com/Hyperfoil/Hyperfoil/master/' + src, { cache: "reload" })
                .then(function(response) {
                    response.text().then(function (text) {
                    if (slice != null) {
                      slice = slice.split(":");
                      text = text.split(/\r?\n/).slice(slice[0], slice[1]).join("\n");
                    }
                      code.innerHTML = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                      prettyPrint();
                    })
                })
          } else {
            response.text().then(function (text) {
              if (slice != null) {
                slice = slice.split(":");
                text = text.split(/\r?\n/).slice(slice[0], slice[1]).join("\n");
              }
              code.innerHTML = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
              prettyPrint();
            })
          }
      })
  }