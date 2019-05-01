function sillyAlert(){
    alert("I'm a silly test function")
}

async function fetchGithubUser(username){
    const response = await fetch('https://api.github.com/users/' + username);
    const user = await response.json();
    console.log(JSON.stringify(user));
    return user;
}

async function fetchGithubUserRepos(username){
    const response = await fetch('https://api.github.com/users/' + username + '/repos');
    const repos = await response.json();
    console.log(JSON.stringify(repos));
    return repos;
}

async function fetchGithubRepo(reponame){
    const response = await fetch('https://api.github.com/repos/' + reponame);
    const repo = await response.json();
    console.log(JSON.stringify(repo));
    return repo;
}