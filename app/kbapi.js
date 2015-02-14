

// Collection of simple (Bootstrap/jQuery based) UI helper methods
function UIUtils() {

    // this method will display an absolutely position notification
    // in the app on the 'body' tag.  This is useful for api success/failure
    // notifications
    this.notify = function(text, type, keep) {
        var ele = $('<div id="notification-container">'+
                        '<div id="notification" class="'+type+'">'+
                            (keep ? ' <small><div class="close">'+
                                        '<span class="glyphicon glyphicon-remove pull-right">'+
                                        '</span>'+
                                    '</div></small>' : '')+
                            text+
                        '</div>'+
                    '</div>');

        $(ele).find('.close').click(function() {
             $('#notification').animate({top: 0}, 200, 'linear');
        })

        $('body').append(ele)
        $('#notification')
              .delay(200)
              .animate({top: 50}, 400, 'linear',
                        function() {
                            if (!keep) {
                                $('#notification').delay(2000)
                                                  .animate({top: 0}, 200, 'linear', function() {
                                                    $(this).remove();
                                                  })

                            }
                        })
    }

    var msecPerMinute = 1000 * 60;
    var msecPerHour = msecPerMinute * 60;
    var msecPerDay = msecPerHour * 24;
    var dayOfWeek = {0: 'Sun', 1: 'Mon', 2:'Tues',3:'Wed',
                     4:'Thurs', 5:'Fri', 6: 'Sat'};
    var months = {0: 'Jan', 1: 'Feb', 2: 'March', 3: 'April', 4: 'May',
                  5:'June', 6: 'July', 7: 'Aug', 8: 'Sept', 9: 'Oct',
                  10: 'Nov', 11: 'Dec'};
    this.formateDate = function(timestamp) {
        var date = new Date()

        var interval =  date.getTime() - timestamp;

        var days = Math.floor(interval / msecPerDay );
        interval = interval - (days * msecPerDay);

        var hours = Math.floor(interval / msecPerHour);
        interval = interval - (hours * msecPerHour);

        var minutes = Math.floor(interval / msecPerMinute);
        interval = interval - (minutes * msecPerMinute);

        var seconds = Math.floor(interval / 1000);

        if (days == 0 && hours == 0 && minutes == 0) {
            return seconds + " secs ago";
        } else if (days == 0 && hours == 0) {
            if (minutes == 1) return "1 min ago";
            return  minutes + " mins ago";
        } else if (days == 0) {
            if (hours == 1) return "1 hour ago";
            return hours + " hours ago"
        } else if (days == 1) {
            var d = new Date(timestamp);
            var t = d.toLocaleTimeString().split(':');
            return 'yesterday at ' + t[0]+':'+t[1]+' '+t[2].split(' ')[1]; //check
        } else if (days < 7) {
            var d = new Date(timestamp);
            var day = dayOfWeek[d.getDay()]
            var t = d.toLocaleTimeString().split(':');
            return day + " at " + t[0]+':'+t[1]+' '+t[2].split(' ')[1]; //check
        } else  {
            var d = new Date(timestamp);
            return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear(); //check
        }
    }

    // takes mod date time (2014-03-24T22:20:23)
    // and returns unix (epoch) time
    this.getTimestamp = function(datetime){
        if (!datetime) return;
        var ymd = datetime.split('T')[0].split('-');
        var hms = datetime.split('T')[1].split(':');
        hms[2] = hms[2].split('+')[0];
        return Date.UTC(ymd[0],ymd[1]-1,ymd[2],hms[0],hms[1],hms[2]);
    }

    // interesting solution from http://stackoverflow.com/questions
    // /15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
    this.readableSize = function(bytes) {
       var units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
       if (bytes == 0) return '0 Bytes';
       var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
       return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + units[i];
    };

    this.objTable = function(p) {
        var obj = p.obj;
        var keys = p.keys;

        // option to use nicely formated keys as labels
        if (p.keysAsLabels ) {
            var labels = []
            for (var i in keys) {
                var str = keys[i].key.replace(/(id|Id)/g, 'ID')
                var words = str.split(/_/g);
                for (var j in words) {
                    words[j] = words[j].charAt(0).toUpperCase() + words[j].slice(1)
                }
                var name = words.join(' ')
                labels.push(name);
            }
        } else if ('labels' in p) {
            var labels = p.labels;
        } else {
            // if labels are specified in key objects, use them
            for (var i in keys) {
                var key_obj = keys[i];
                if ('label' in key_obj) {
                    labels.push(key_obj.label);
                } else {
                    labels.push(key_obj.key)
                }

            }
        }


        var table = $('<table class="table table-striped table-bordered">');
//        style="margin-left: auto; margin-right: auto;"

        for (var i in keys) {
            var key = keys[i];
            var row = $('<tr>');

            if (p.bold) {
                var label = $('<td><b>'+labels[i]+'</b></td>')
            } else {
                var label = $('<td>'+labels[i]+'</td>');
            }

            var value = $('<td>');

            if ('format' in key) {
                var val = key.format(obj)
                value.append(val)
            } else if (key.type == 'bool') {
                value.append((obj[key.key] == 1 ? 'True' : 'False'))
            } else {
                value.append(obj[key.key])
            }
            row.append(label, value);

            table.append(row);
        }

        return table;
    }

    this.listTable = function(p) {
        var array = p.array;
        var labels = p.labels;
        var bold = (p.bold ? true : false);

        var table = $('<table class="table table-striped table-bordered" \
                              style="margin-left: auto; margin-right: auto;"></table>');
        for (var i in labels) {
            table.append('<tr><td>'+(bold ? '<b>'+labels[i]+'</b>' : labels[i])+'</td> \
                          <td>'+array[i]+'</td></tr>');
        }

        return table;
    }

    // this takes a list of refs and creates <workspace_name>/<object_name>
    // if links is true, hrefs are returned as well
    this.translateRefs = function(reflist, links) {
        var obj_refs = []
        for (var i in reflist) {
            obj_refs.push({ref: reflist[i]})
        }

        var prom = kb.ws.get_object_info(obj_refs)
        var p = $.when(prom).then(function(refinfo) {
            var refhash = {};
            for (var i=0; i<refinfo.length; i++) {
                var item = refinfo[i];
                var full_type = item[2];
                var module = full_type.split('.')[0];
                var type = full_type.slice(full_type.indexOf('.')+1);
                var kind = type.split('-')[0];
                var label = item[7]+"/"+item[1];
                var route;
                switch (kind) {
                    case 'FBA':
                        sub = 'fbas/';
                        break;
                    case 'FBAModel':
                        sub = 'models/';
                        break;
                    case 'Media':
                        route = 'media/';
                        break;
                    case 'Genome':
                        route = 'genomes/';
                        break;
                    case 'MetabolicMap':
                        route = 'maps/';
                        break;
                    case 'PhenotypeSet':
                        route = 'phenotype/';
                        break;
                }

                var link = '<a href="#/'+route+label+'">'+label+'</a>';
                refhash[reflist[i]] = {link: link, label: label};
            }
            return refhash
        })
        return p;
    }

    this.refsToJson = function(ref_list) {
        var obj_refs = []
        for (var i in ref_list) {
            obj_refs.push({ref: ref_list[i]})
        }

        var obj = {}
        var prom = kb.ws.get_object_info(obj_refs)
        var p = $.when(prom).then(function(refinfo) {
            for (var i=0; i<refinfo.length; i++) {
                var item = refinfo[i];
                var full_type = item[2];
                var module = full_type.split('.')[0];
                var type = full_type.slice(full_type.indexOf('.')+1);
                var kind = type.split('-')[0];
                var label = item[7]+"/"+item[1];

                if ( !(kind in obj) )  obj[kind] = [];

                obj[kind].push(label);
            }
            return obj;
        })
        return p;
    }


    this.formatUsers = function(perms, mine) {
        var users = []
        for (var user in perms) {
            if (user == USER_ID && !mine && !('*' in perms)) {
                users.push('You');
                continue;
            } else if (user == USER_ID) {
                continue;
            }
            users.push(user);
        }

        // if not shared, return 'nobody'
        if (users.length == 0) {
            return 'Nobody';
        };

        // number of users to show before +x users link
        var n = 3;
        var share_str = ''
        if (users.length > n) {
            /*if (users.slice(n).length == 1) {*/
                share_str = users.slice(0, n).join(', ')+', '+
                        ' <a class="btn-share-with" data-users="'+users+'">+'
                        +users.slice(n).length+' user</a>';
            /*} else if (users.slice(2).length > 1) {
                share_str = users.slice(0, n).join(', ')+ ', '+
                        ' <a class="btn-share-with" data-users="'+users+'"> +'
                        +users.slice(n).length+' users</a>';
            }*/

        } else if (users.length > 0 && users.length <= n) {
            share_str = users.slice(0, n).join(', ');
        }
        return share_str;
    }

    this.globalPermDropDown = function(perm) {
        var dd = $('<select class="form-control create-permission" data-value="n">\
                        <option value="n">None</option>\
                        <option value="r">Read</option>\
                    </select>')
        if (perm == 'n') {
            dd.find("option[value='n']").attr('selected', 'selected');
        } else if (perm == 'r') {
            dd.find("option[value='r']").attr('selected', 'selected');
        } else {
            dd.find("option[value='n']").attr('selected', 'selected');
        }

        return $('<div>').append(dd).html();
    }

    // jQuery plugins that you can use to add and remove a
    // loading giff to a dom element.
    $.fn.loading = function(text, big) {
        $(this).rmLoading()

        if (big) {
            if (typeof text != 'undefined') {
                $(this).append('<p class="text-center text-muted loader"><br>'+
                     '<img src="assets/img/ajax-loader-big.gif"> '+text+'</p>');
            } else {
                $(this).append('<p class="text-center text-muted loader"><br>'+
                     '<img src="assets/img/ajax-loader-big.gif"> loading...</p>')
            }
        } else {
            if (typeof text != 'undefined') {
                $(this).append('<p class="text-muted loader">'+
                     '<img src="assets/img/ajax-loader.gif"> '+text+'</p>');
            } else {
                $(this).append('<p class="text-muted loader">'+
                     '<img src="assets/img/ajax-loader.gif"> loading...</p>')
            }

        }
        return this;
    }
    $.fn.rmLoading = function() {
        $(this).find('.loader').remove();
    }




}

// This saves a request by service name, method, params, and promise
// Todo: Make as module
function Cache() {
    var cache = [];

    this.get = function(service, method, params) {
        for (var i in cache) {
            var obj = cache[i];
            if (service != obj['service']) continue;
            if (method != obj['method']) continue;
            if ( angular.equals(obj['params'], params) ) { return obj; }
        }
        return undefined;
    }

    this.put = function(service, method, params, prom) {
        var obj = {};
        obj['service'] = service;
        obj['method'] = method;
        obj['prom'] = prom;
        obj['params'] = params;
        cache.push(obj);
        //console.log('Cache after the last "put"', cache)
    }
}


// this is another experiment in caching but for particular objects.
function WSCache() {
    // Todo: only retrieve and store by object ids.

    // cache object
    var c = {};

    this.get = function(params) {

        if (params.ref) {
            return c[params.ref];
        } else {
            var ws = params.ws,
                type = params.type,
                name = params.name;

            if (ws in c && type in c[ws] && name in c[ws][type]) {
                return c[ws][type][name];
            }
        }
    }

    this.put = function(params) {
        // if reference is provided
        if (params.ref) {
            if (params.ref in c) {
                return false;
            } else {
                c[params.ref] = params.prom;
                return true;
            }

        // else, use strings
        } else {
            var ws = params.ws,
                name = params.name,
                type = params.type;

            if (ws in c && type in c[ws] && name in c[ws][type]) {
                return false;
            } else {
                if ( !(ws in c) ) c[ws] = {};
                if ( !(type in c[ws]) ) c[ws][type] = {};
                c[ws][type][name] = params.prom;
                return true;
            }
        }
    }
}

function getBio(type, loaderDiv, callback) {
    var fba = new fbaModelServices('https://kbase.us/services/fba_model_services/');
//    var kbws = new workspaceService('http://kbase.us/services/workspace_service/');
//    var kbws = new workspaceService('http://140.221.84.209:7058');

    var kbws = new Workspace('http://kbase.us/services/ws');

    // This is not cached yet; waiting to compare performanced.
    loaderDiv.append('<div class="progress">\
          <div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 3%;">\
          </div>\
        </div>')

    var bioAJAX = fba.get_biochemistry({});

    var chunk = 250;
    k = 1;
    $.when(bioAJAX).done(function(d){
        if (type == 'cpds') {
            var objs = d.compounds;
        } else if (type == 'rxns') {
            var objs = d.reactions;
        }
        var total = objs.length;
        var iterations = parseInt(total / chunk);
        var data = [];
        for (var i=0; i<iterations; i++) {
            var cpd_subset = objs.slice( i*chunk, (i+1)*chunk -1);
            if (type == 'cpds') {
                var prom = fba.get_compounds({compounds: cpd_subset });
            } else if (type == 'rxns') {
                var prom = fba.get_reactions({reactions: cpd_subset });
            }

            $.when(prom).done(function(obj_data){
                k = k + 1;
                data = data.concat(obj_data);
                var percent = (data.length / total) * 100+'%';
                $('.progress-bar').css('width', percent);

                if (k == iterations) {
                    $('.progress').remove();
                    callback(data)
                }
            });
        }
    })






   self.getWorkspaceSelector = function(all) {
        if (all) {
            var p = self.ws.list_workspace_info({});
        } else {
            var p = self.ws.list_workspace_info({perm: 'w'});
        }

        var prom = $.when(p).then(function(workspaces){
            var workspaces = workspaces.sort(compare)

            function compare(a,b) {
                var t1 = kb.ui.getTimestamp(b[3])
                var t2 = kb.ui.getTimestamp(a[3])
                if (t1 < t2) return -1;
                if (t1 > t2) return 1;
                return 0;
            }

            var wsSelect = $('<form class="form-horizontal" role="form">'+
                                '<div class="form-group">'+
                                    '<label class="col-sm-5 control-label">Workspace</label>'+
                                    '<div class="input-group col-sm-5">'+
                                        '<input type="text" class="select-ws-input form-control focusedInput" placeholder="search">'+
                                        '<span class="input-group-btn">'+
                                            '<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">'+
                                                '<span class="caret"></span>'+
                                            '</button>'+
                                        '</span>'+
                                    //'<a class="btn-new-ws pull-right">New WS</a>'+
                                    '</div>'+
                            '</div>');

            var select = $('<ul class="dropdown-menu select-ws-dd" role="menu">');
            for (var i in workspaces) {
                select.append('<li><a>'+workspaces[i][1]+'</a></li>');
            }

            wsSelect.find('.input-group-btn').append(select);

            var dd = wsSelect.find('.select-ws-dd');
            var input = wsSelect.find('input');

            var not_found = $('<li class="select-ws-dd-not-found"><a><b>Not Found</b></a></li>');
            dd.append(not_found);
            input.keyup(function() {
                dd.find('li').show();

                wsSelect.find('.input-group-btn').addClass('open');

                var input = $(this).val();
                dd.find('li').each(function(){
                    if ($(this).text().toLowerCase().indexOf(input.toLowerCase()) != -1) {
                        return true;
                    } else {
                        $(this).hide();
                    }
                });

                if (dd.find('li').is(':visible') == 1) {
                    not_found.hide();
                } else {
                    not_found.show();
                }
            })

            dd.find('li').click(function() {
                dd.find('li').removeClass('active');

                if (!$(this).hasClass('select-ws-dd-not-found')) {
                    $(this).addClass('active');

                    var val = $(this).text();
                    input.val(val);
                }
            })

            return wsSelect;
        })

        return prom;
    }

}

