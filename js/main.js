var routes = {};
var templates = {};

function route(path, template) {
    routes[path] = { template: template };
}

function template(name, builders) {
    templates[name] = builders;
}

function router() {
    let element = document.getElementById('router-div');
    let hash = location.hash
    let url = location.hash.slice(1) || '/';
    let indexOfSecond = url.indexOf("/", url.indexOf("/") + 1)
    if (indexOfSecond !== -1)
        url = url.slice(0, url.indexOf("/", url.indexOf("/") + 1))
    let slicedOnce = hash.slice(2)
    let pathVariable = slicedOnce.slice(slicedOnce.indexOf("/") + 1);
    let route = routes[url];
    if (element) {
        element.innerHTML = ""
        let builders = templates[route.template]
        builders.forEach(builder => {
            if (builder.length == 0)
                builder().then((content) => builder(pathVariable).then((content) => element.innerHTML = element.innerHTML + content))
            else
                if (pathVariable && pathVariable !== '')
                    if (builders.indexOf(builder) == 0)
                        builder(pathVariable).then((content) => element.innerHTML = content + element.innerHTML)
                    else
                        builder(pathVariable).then((content) => element.innerHTML = element.innerHTML + content)
        });
    }
}

template('home', [() => {
    return new Promise((resolve) => {
        resolve(`
                <div class="card user-detail-div mb-3">
                    <div class="card-header">
                        </div>
                    <div class="card-body home-message-div">
                        <p class="card-text"> Procure por usuários do Github na caixa de pesquisa acima. ! </p>
                    </div>
                </div>
                `)
    })
}]);

template('repo', [(repofullname) => {
    return fetchGithubRepo(repofullname)
        .then((repo) => {
            return `
            <div class="repo-detail-div mb-3 ">
                <div class="container-fluid">
                    <div class="row ornament-div">
                    </div>
                    <div class="row repo-many-div">
                        <div class="repo-detail-content-div">
                            <div class="left">
                                <div class="mt-1">
                                    <span class="name">${repo.name || "Username Missing"}</span>
                                     - <a href=""${repo.html_url} class="">${repo.html_url || "email indisponível"}</a>
                                </div>
                            </div>
                            <div class="right ml-1">
                                <div class="repo-lang-star">
                                    <div class="language mr-1"> 
                                        <div class="label-with-count">
                                            <div class="label-prepend" > 
                                                <img class="mr-1" src="/desafioFrontend/open-iconic/png/code.png" />  Lang
                                            </div>
                                            <div class="count">
                                                    ${repo.language || ""}  
                                            </div>
                                        </div>    
                                    </div>
                                    <div class="star-count"> 
                                        <div class="label-with-count">
                                            <div class="label-prepend" > 
                                                <img class="mr-1" src="/desafioFrontend/open-iconic/png/star.png" />  Stars
                                            </div>
                                            <div class="count">
                                                ${repo.stargazers_count || "0"} 
                                            </div>
                                        </div>    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row bio-div">
                        <div class="container-fluid ">
                            <div class="about-header-div row" > Descrição </div>
                            <div class="about-text-div row">${repo.description || "Nenhuma informação disponível"}</div>
                        </div>
                    </div>
                </div>
            </div>
        `
        })
}]);

template('user',
    [(username) => {
        return fetchGithubUser(username)
            .then((user) => {
                let content = `
                                <div class="user-detail-div mb-3 ">
                                    <div class="container-fluid">
                                        <div class="row ornament-div">
                                        </div>
                        `
                if (user.login)
                    content = content + `
                                        <div class="row user-detail-many-div">
                                            <div class="avatar-img-div centered">
                                                <img src="${user.avatar_url || ""}"/>
                                            </div>
                                            <div class="user-detail-many-content-div">
                                                <div class="top">
                                                    <div class="name mt-1">${user.name || "Username indisponível"}</div>
                                                    <div class="login">${user.login}@github.com </div>
                                                    <div class="mail">(${user.email || "email indisponível"})</div>
                                                </div>
                                                <div class="bottom">
                                                    <div class="follow-div">
                                                        <span class="badge badge-primary badge-pill">Followers ${user.followers || "0"}</span>
                                                        <span class="badge badge-primary badge-pill">Following ${user.following || ""}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row bio-div">
                                            <div class="container-fluid ">
                                                <div class="about-header-div row" > Sobre (bio) </div>
                                                <div class="about-text-div row">${user.bio || "Nenhuma informação disponível"}</div>
                                            </div>
                                        </div>
                                            `
                else
                    content = content + `
                                <div class="invalid-user mt-1"> Nenhum usuário com o nome <strong>${username}</strong> encontrado. </div>
                            `
                content = content + `
                                    </div>
                                </div>
                            `
                return content;
            })
    },
    (username) => {
        return fetchGithubUserRepos(username)
            .then((repos) => {
                repos.sort((a, b) => parseFloat(b.stargazers_count) - parseFloat(a.stargazers_count))
                let component = `
                        <div class="card">
                            <div class="card-header">
                                Repositórios
                            </div>
                            <div class="card-body">
                            
                        <ul class='list-group repo-list'>
                        `
                for (const repo of repos) {
                    component = component + `
                                <li class="list-group-item mb-2">
                                    <div class="repo-list-item-div">
                                        <div class="repo-name-div">
                                            ${repo.name}
                                        </div>
                                        <div class="repo-details-div">
                                            <a href="#/repo/${repo.full_name}">Detalhes</a>
                                        </div>
                                    </div>
                                </li>
                            `
                }
                component = component + ` 
                                    </ul>
                                </div>
                            </div> `
                return component
            })
    }]
)

route('/', 'home');
route('/home', 'home');
route('/repo', 'repo');
route('/user', 'user');

window.addEventListener('load', router);
window.addEventListener('hashchange', router);


async function fetchGithubUser(username) {
    const response = await fetch('https://api.github.com/users/' + username);
    const user = await response.json();
    return user;
}

async function fetchGithubUserRepos(username) {
    const response = await fetch('https://api.github.com/users/' + username + '/repos');
    const repos = await response.json();
    return repos;
}

async function fetchGithubRepo(repofullname) {
    const response = await fetch('https://api.github.com/repos/' + repofullname);
    const repo = await response.json();
    return repo;
}

function handleUserSearch() {
    window.location.href = "#/user/" + $('#username-input').val();
}

$(document).ready(function () {
    $('#username-input').on('keypress', (event) => {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            $('#user-search-button').click()
        }
    });
});