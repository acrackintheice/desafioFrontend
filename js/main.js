var routes = {};
var templates = {};

template('home', () => {
    return `
            <div class="card user-detail-div mb-3">
                <div class="card-header">
                    Informações
                </div>
                <div class="card-body">
                    <p class="card-text"> Procure por usuários do Github no componente de pesquisa acima </p>
                </div>
            </div>
            `
});
template('repo', () => {
    return `<h1> This is a repository </h1>`
});
template('user', () => {
    let user = fetchGithubUser('acrackintheice')
    return `
            <div class="card user-detail-div mb-3">
                <div class="card-header">
                    Detalhes do Usuário
                </div>
                <div class="card-body">
                    <p class="card-text">${user.name || ""} (${user.login}) </p>
                    <p class="card-text">${user.email || ""}</p>
                    <p class="card-text">${user.avatar_url || ""}</p>
                    <p class="card-text">${user.followers || ""}</p>
                    <p class="card-text">${user.following || ""}</p>
                    <p class="card-text">${user.bio || ""}</p>
                </div>
            </div>
            <div class="repo-list-div">
                <ul class="list-group">
                    <li class="list-group-item">Repository 1</li>
                    <li class="list-group-item">Dapibus ac facilisis in</li>
                    <li class="list-group-item">Morbi leo risus</li>
                    <li class="list-group-item">Porta ac consectetur ac</li>
                    <li class="list-group-item">Repository N</li>
                </ul>
            </div>
        `
});

function router() {
    let element = document.getElementById('router-div');
    var url = location.hash.slice(1) || '/';
    var route = routes[url];
    if (element && route.controller) {
        element.innerHTML = templates[route.template]
    }
}

route('/', 'home');
route('/repo', 'repo');
route('/user', 'user');

window.addEventListener('load', router);
window.addEventListener('hashchange', router);


async function fetchGithubUser(username) {
    const response = await fetch('https://api.github.com/users/' + username);
    const user = await response.json();
    console.log(JSON.stringify(user));
    return user;
}

async function fetchGithubUserRepos(username) {
    const response = await fetch('https://api.github.com/users/' + username + '/repos');
    const repos = await response.json();
    console.log(JSON.stringify(repos));
    return repos;
}

async function fetchGithubRepo(reponame) {
    const response = await fetch('https://api.github.com/repos/' + reponame);
    const repo = await response.json();
    console.log(JSON.stringify(repo));
    return repo;
}
