
function generateBookmark() {
    var tpServ = $('.tpserver').val();
    var tcServ = $('.tcserver').val();
    var tcProjId = $('.tcprojectid').val();
    var reviewers = [];
    $('.reviewer').each(function() {
        var input = $(this).find('input');
        if(input.val().length > 0) {
            reviewers.push(input.val());
        }
    });
    var testers = [];
    $('.tester').each(function() {
        var input = $(this).find('input');
        if(input.val().length > 0) {
            testers.push(input.val());
        }
    });
    if(tpServ.length === 0 ||
            tcServ.length === 0 ||
            tcProjId.length === 0 ||
            reviewers.length === 0 ||
            testers.length === 0) {
        return;
    }
    var bookmark = createBookmarkUrl(tpServ, tcServ, tcProjId, reviewers, testers);
    $('.bookmarktext').text(bookmark);
    $('.bookmark').show();
}

function removeReviewer(event) {
    $(event.target).parents('.reviewer').remove();
}

function addReviewer(event) {
    var parent = $(event.target).parents('.reviewer');
    var txt = parent.find('input');
    if(txt.val().trim().length === 0) {
        return;
    }
    txt.unbind('keyup');
    var button = parent.find('button');
    button.removeClass('btn-success');
    button.addClass('btn-danger');
    button.text('-');
    button.attr('onclick','removeReviewer(event);');
    var reviewer = $('<div class="input-group reviewer"><span class="input-group-addon">@</span><input type="text" class="form-control"><span class="input-group-btn"><button class="btn btn-success" type="button" onclick="addReviewer(event);">+</button></span></div>');
    reviewer.keyup(function(e) {
        if(e.keyCode === 13) {
            addReviewer(e);
        }
    });
    parent.parents('.reviewers').append(reviewer);
    reviewer.find('input').focus();
}

function removeTester(event) {
    $(event.target).parents('.tester').remove();
}

function addTester(event) {
    var parent = $(event.target).parents('.tester');
    var txt = parent.find('input');
    if(txt.val().trim().length === 0) {
        return;
    }
    txt.unbind('keyup');
    var button = parent.find('button');
    button.removeClass('btn-success');
    button.addClass('btn-danger');
    button.text('-');
    button.attr('onclick','removeTester(event);');
    var tester = $('<div class="input-group tester"><span class="input-group-addon">@</span><input type="text" class="form-control"><span class="input-group-btn"><button class="btn btn-success" type="button" onclick="addTester(event);">+</button></span></div>');

    tester.keyup(function(e) {
        if(e.keyCode === 13) {
            addTester(e);
        }
    });
    parent.parents('.testers').append(tester);
    tester.find('input').focus();
}
function createBookmarkUrl(tpServer, teamcityServer, teamcityProjectId, reviewers, testers) {
    var bookmark = "javascript:(function(){";
    bookmark += "if(!($=window.jQuery)){";
    bookmark += "script=document.createElement('script');";
    bookmark += "script.src='http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';";
    bookmark += "script.onload=doStuff;";
    bookmark += "document.body.appendChild(script)";
    bookmark += "}else{";
    bookmark += "doStuff()";
    bookmark += "}";

    bookmark += "function doStuff(){";
    bookmark += "var userName=$('a.name').text().trim();";
    bookmark += "var branchName=$('span.branch-name:last').text().trim();";
    bookmark += "var storyNumber=branchName.split('-')[0];";
    bookmark += "var storyRoot='http://" + tpServer + "/';";
    bookmark += "var storyApi=storyRoot+'api/v1/UserStories/'+storyNumber+'?format=json';";
    bookmark += "var storyLink=storyRoot+'entity/'+storyNumber;";

    //BEGIN: pull request text
    bookmark += "var pullRequest=':8ball:  Do Not Pull Until All Items Have Been Checked Off :8ball: \\n";
    bookmark += "\\n";
    bookmark += "Shepherd - @' + userName + '\\n";
    bookmark += "\\n";
    bookmark += "- [ ] The [Feature] (' + storyLink + ') is dev complete.\\n";
    bookmark += "- [ ] The [builds] (http://teamcity/project.html?projectId=" + teamcityProjectId + "&branch_" + teamcityProjectId + "=' + branchName + ') must have run successfully.\\n";
    bookmark += "- [ ] The help article is fully complete\\n";
    bookmark += "\\n";
    bookmark += "Reviewers:\\n";
    for(var i = 0; i < reviewers.length; ++i) {
        bookmark += "- [ ] @" + reviewers[i] + "\\n";
    }
    bookmark += "\\n";
    bookmark += "Test:\\n";
    for(var j = 0; j < testers.length; ++j) {
        bookmark += "- [ ] @" + testers[j] + "\\n";
    }
    bookmark += "';";
    //END: pull request text
    
    bookmark += "$('#pull_request_title').val(branchName);";
    bookmark += "$('#pull_request_body').val(pullRequest);";
    bookmark += "}"; //function doStuff(){

    bookmark += "})()";

    return bookmark;
}

$(document).ready(function(){
    // add initial reviewer input control
    var reviewerHtml = '<div class="input-group reviewer">';
    reviewerHtml += '<span class="input-group-addon">@</span>';
    reviewerHtml += '<input type="text" class="form-control" onkeyup="if(event.keyCode===13){addReviewer(event);}">';
    reviewerHtml += '<span class="input-group-btn">';
    reviewerHtml += '<button class="btn btn-success" type="button" onclick="addReviewer(event);">+</button>';
    reviewerHtml += '</span>';
    reviewerHtml += '</div>';

    $('.reviewers').append($(reviewerHtml));

    // add initial tester input control
    var testerHtml = '<div class="input-group tester">';
    testerHtml += '<span class="input-group-addon">@</span>';
    testerHtml += '<input type="text" class="form-control" onkeyup="if(event.keyCode===13){addTester(event);}">';
    testerHtml += '<span class="input-group-btn">';
    testerHtml += '<button class="btn btn-success" type="button" onclick="addTester(event);">+</button>';
    testerHtml += '</span>';
    testerHtml += '</div>';

    $('.testers').append($(testerHtml));
});

