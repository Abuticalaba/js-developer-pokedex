const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

class PokemonDetail {
    number;
    name;
    type;
    types = [];
    photo;
    weight;
    height;
    expBase;
    abilities = [];
}

function convertPokemonToLi(pokemon) {
    return `
        <a onclick="paginaNova(${pokemon.number})" href="#">
            <li class="pokemon ${pokemon.type}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    <img src="${pokemon.photo}"
                         alt="${pokemon.name}">
                </div>
            </li>
        </a>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })

}

const screenDetail = document.querySelector('.screenDetail')
const fundo = document.querySelector('.content')

//click aparecer detalhes
function paginaNova(identifyPoke) {
    
    const identify = identifyPoke;
    const url = `https://pokeapi.co/api/v2/pokemon/${identify}`
    console.log(identify);
    
    screenDetail.classList.add("opacidade");
    fundo.classList.add("opacidade0");
   
    fetch(url)
    .then((response) => response.json())
    .then( //instanciando meu pokemon
        function(responseJson) {
            let pokemonDetail = new PokemonDetail()
            pokemonDetail.number = responseJson.id
            pokemonDetail.name = responseJson.name

            let types = responseJson.types.map((typeSlot) => typeSlot.type.name)
            let [type] = types

            pokemonDetail.types = types
            pokemonDetail.type = type

            pokemonDetail.photo = responseJson.sprites.other.dream_world.front_default

            pokemonDetail.height = responseJson.height
            pokemonDetail.weight = responseJson.weight
            pokemonDetail.expBase = responseJson.base_experience

            pokemonDetail.abilities = responseJson.abilities.map((typeAbilit) => typeAbilit.ability.name)

            return pokemonDetail
        }
    )
    .then((pokemonDetail) => {
        console.log(pokemonDetail)
        inserirHtml(pokemonDetail);
    })

   
} 

//função para inserir o HTML
function inserirHtml(pokemonDetail) {
    screenDetail.innerHTML = `
    <header class="${pokemonDetail.type}1">
        <div class="icons">
            <a href="#" onclick="voltar()">
                <img src="assets/img/seta-esquerda.png" alt="seta para voltar a página principal">
            </a>
            <img src="assets/img/coracao.png" alt="coração">
        </div>
        <div class="infoPokemon">
            <h1 class="namePokemon">${pokemonDetail.name}</h1>
            <span id="element" class="numberPokemon">#${pokemonDetail.number}</span>
        </div>
        <ol class="typesPokemon">
            ${pokemonDetail.types.map((type) => `<li class="${type}">${type}</li>`).join('')}
        </ol>
        <img class="imagem" src="${pokemonDetail.photo}" alt="oi">
    </header>
    
    <footer>
        <ul class="menuDetail">
            <a href="#">
                <li style="color: black; border-bottom: 1px solid black;">About</li>
            </a>
            <a href="#">
                <li>Base Stats</li>
            </a>
            <a href="#">
                <li>Evolution</li>
            </a>
            <a href="#">
                <li>Moves</li>
            </a>
        </ul>
        <div class="Detail">
            <ul class="title">
                <li>
                    <span>Exp base:</span>
                </li>
                <li>
                    <span>height:</span>
                </li>
                <li>
                    <span>Weight:</span>
                </li>
                <li>
                    <span>Abilities:</span>
                </li>
            </ul>
            <ul class="result">
                <li>
                    <span>${pokemonDetail.expBase}</span>
                </li>
                <li>
                    <span>${pokemonDetail.height}</span>
                </li>
                <li>
                    <span>${pokemonDetail.weight}</span>
                </li>
                <li class="${pokemonDetail.type} space">
                    <span>${pokemonDetail.abilities.map((ability) => ability).join(' / ')}</span>
                </li>
            </ul>
        </div>
    </footer>
    `
}

//click sumir detalhes
function voltar() {
    screenDetail.classList.remove("opacidade");
    fundo.classList.remove("opacidade0");
}

loadPokemonItens(offset, limit);


loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})


