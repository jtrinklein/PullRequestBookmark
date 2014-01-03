
function createBookmarkUrl(tpServer, teamcityServer, teamcityProjectId, reviewers, testers) {
    var bookmark = "javascript:(function(){if(!($=window.jQuery)){script=document.createElement('script');script.src='http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';script.onload=doStuff;document.body.appendChild(script)}else{doStuff()}function doStuff(){var userName=$('a.name').text().trim();var branchName=$('span.branch-name:last').text().trim();var storyNumber=branchName.split('-')[0];var storyRoot='http://";
    bookmark += tpServer + "/';var storyApi=storyRoot+'api/v1/UserStories/'+storyNumber+'?format=json';var storyLink=storyRoot+'entity/'+storyNumber;";
    bookmark += "var pullRequest=':8ball:  Do Not Pull Until All Items Have Been Checked Off :8ball: \\n\\n";
    bookmark += "Shepherd - @' + userName + '\\n\\n";
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
    bookmark += "';"
    bookmark += "$('#pull_request_title').val(branchName);$('#pull_request_body').val(pullRequest)}})()";

    return bookmark;
}

