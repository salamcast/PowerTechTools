// Local Storage Class
// > will add on as needed
var dbh5 = {
    getPage: function(p) {
        if (localStorage.getItem(p) !== null) {
            return JSON.parse(localStorage.getItem(p));
        }
        return [];
    },
    setPage: function(p, data) {
        localStorage.setItem(p, JSON.stringify(data));
        return true;
    },
    deletePage: function(p) {
        return localStorage.removeItem(p);
    },
    addItem: function(p, data) {
        var page = dbh5.getPage(p);
        page.push(data);
        return dbh5.setPage(p, page);
    },
    deleteItem: function(p, data) {
        var page = dbh5.getPage(p);
        var newpage;
        angular.forEach(page, function(d) {
            if (d != data) {
                newpage.push(d);
            }
        });
        return dbh5.setPage(p, newpage);
    },
    updateItem: function(p, old, data) {
        var page = dbh5.getPage(p);
        var newpage;
        angular.forEach(page, function(d) {
            if (d !== old) {
                newpage.push(d);
            } else {
                newpage.push(data);
            }
        });
        return dbh5.setPage(p, newpage);
    }


};
