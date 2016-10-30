function LiveSearch(url, timeout) {
    var timeoutId = "";

    function execTimeout(callback, timeout) {
        if (!callback || typeof callback !== "function") {
            console.log("execTimeout: callback is not a function!");
            return;
        }

        clearTimeout(timeoutId);
        timeoutId = setTimeout(callback, timeout || 500)
    };

    this.getResult = function (options, callback, beforesend) {
        if (!callback || typeof callback !== "function") {
            console.log("getResult: callback is not a function!");
            return;
        } else if (!options.q || options.q.length < 2) {
            return;
        }

        execTimeout(function () {
            $.ajax({
                url: url + '?q=' + options.q + '+user:' + options.user,
                crossDomain: true,
                success: callback,
                beforeSend: beforesend,
                error: function (json) {
                    console.log(json)
                }
            });
        }, timeout);
    }
}

$(function () {
        var githubSearch = new LiveSearch('https://api.github.com/search/repositories', 1000);
        var tmpl = _.template($('#content-template').html());

        function renderResult(json) {
            var content = tmpl(json);
            $('#results').html(content);
        }
        function beforeSend() {
            $('#results').html('<div class=loading">Loading...</div>');
        }
        function onKeupAction() {
            var query = $('#mainSearch').val();
            if (query.length > 1) {
                githubSearch.getResult({q: query, user: 'ProgSelC'}, renderResult, beforeSend);
            }
        }

        $('#mainSearch').keyup(onKeupAction);
    }
);