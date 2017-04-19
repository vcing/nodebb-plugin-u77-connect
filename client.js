$(document)
    .ready(function () {
        var currentURL = document.URL;
        currentURL = currentURL.split("?")[0];
        app.logout = function () {
            $(window).trigger('action:app.logout');

            /*
			Set session refresh flag (otherwise the session check will trip and throw invalid session modal)
			We know the session is/will be invalid (uid mismatch) because the user is logging out
		*/
            app.flags = app.flags || {};
            app.flags._sessionRefresh = true;

            $.ajax(config.relative_path + '/logout', {
                type: 'POST',
                headers: {
                    'x-csrf-token': config.csrf_token
                },
                success: function () {
                    var payload = {
                        next: config.relative_path + '/'
                    };

                    $(window).trigger('action:app.loggedOut', payload);
                    window.location.href = 'http://n.u77.com/member/logout?from='+currentURL;
                }
            });
        };
        if (app.user.uid) {
            // console.log("logged in!");
        } else {
            // console.log("not logged in!");
            // {"status":100,"msg":"ok","data":{"id":42561,"name":"U77TY","avatar":"00/37/42
            // 561.png","email":"2131287@qq.com","uid":"","sign":"3e1626a256d03b44ab6abce0ef
            // 2 0ecf7"}} {"status":101,"msg":"not login"}

            $.ajax({
                type: "GET",
                url: "http://n.u77.com/user/info",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,

                success: function (data) {
                    if (data.status != 100) 
                        return;
                    var loginData = data.data;
                    loginData.returnTo = currentURL;
                    loginData.remember = 1;
                    loginData.username = loginData.id;
                    loginData.password = loginData.sign;

                    $.ajax('/login', {
                        type: 'POST',
                        data: loginData,
                        headers: {
                            'x-csrf-token': config.csrf_token
                        },
                        success: function () {
                            window.location.href = currentURL;
                        }
                    });
                },

                error: function () {}

            })
            // $.get('http://n.u77.com/user/info', function (data, status) {});
        }
    });