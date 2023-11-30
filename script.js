var Evolucion=""
async function detailpokemon(pokemonName) {
    try { 
        
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const pokemon = response.data;
        const idPokemon = pokemon.id;
        const nombre = pokemon.name;
        const habilidad = pokemon.abilities;
        let habilidadTexto = "";
        for (let i = 0; i < habilidad.length; i++) {
            if (i > 0) {
                habilidadTexto += ", "; 
            }
            habilidadTexto += habilidad[i].ability.name;
        }
       
        const pokemonDescription = await getPokemonDescription(idPokemon)
        const descripcion = pokemonDescription.flavorText.replace(/[\n\s]+/g, ' ');
        const urlCadenaEvolucion =  pokemonDescription.evolutionChain
        const imageUrl = pokemon.sprites.other['official-artwork'].front_default;
        const cadenaEvolucion = await getEvolutions(urlCadenaEvolucion)
        document.getElementById("nombrePokemon").innerHTML=nombre 
        document.getElementById("descripcion").innerHTML=descripcion
        document.getElementById("imagen").src=imageUrl
        document.getElementById("habilidad").innerHTML=habilidadTexto
        document.getElementById("evolucion").innerHTML=cadenaEvolucion
             
        Evolucionar(cadenaEvolucion,nombre)
        

    } catch (error) {
        
        window.alert("Error al buscar el pokemon o no existe")  
    }
}
async function Evolucionar(cadenaEvolucion,nombre){
    try {
        const longitudEvolucion=(Object.keys(cadenaEvolucion).length)
        var posicionNombre=longitudEvolucion
        for (var i = 0; i < longitudEvolucion; i++) 
         {
           if(cadenaEvolucion[i]==nombre)
           { 
                posicionNombre=i
                break
            }
        
          }
        if (posicionNombre<longitudEvolucion-1)
        {document.getElementById("Evolucion").hidden=false
        Evolucion=cadenaEvolucion[posicionNombre+1]}
        else
            {Evolucion=""
            document.getElementById("Evolucion").hidden=true}

            
    } catch (error) {
      
       window.alert("Error no se encontro evolucion")  
    }
}
async function nameEvolution(){
    detailpokemon(Evolucion); 

}

async function poke_search() {
    const element = document.getElementById("idSearch").value;
      console.log(element);
    detailpokemon(element);  
    
  }

async function getPokemonDescription(id_pokemon){
    try{
       const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id_pokemon}`);
     //  console.log(`La petición a la API se completó correctamente con status: ${response.status}`);
        const flavorTextEntries = response.data['flavor_text_entries'];
        let spanishFlavorText = '';
        for (const entry of flavorTextEntries) {
            if (entry.language.name === 'es') {
                spanishFlavorText = entry.flavor_text;
                break; 
            }
        }
        const data = {
            flavorText: spanishFlavorText,
            evolutionChain: response.data['evolution_chain']['url'],
        };
        return data;

    } catch(error){
         console.error(`fallo la petición a la api con error: ${error.message}`);
    }    
}

async function getEvolutions(evolutionChainUrl) {
    try {
       const response = await axios.get(evolutionChainUrl);
      // console.log(`La petición a la cadena de evolución se completó correctamente con status: ${response.status}`);
        const chainData = response.data.chain;
        const evolutions = [];
         function extractEvolutions(chain) {
            if (chain.species && chain.species.name) {
                evolutions.push(chain.species.name);
            }
            if (chain.evolves_to && chain.evolves_to.length > 0) {
                chain.evolves_to.forEach(subchain => {
                    extractEvolutions(subchain);
                });
            }
        }
        extractEvolutions(chainData);
        return evolutions;

    } catch (error) {
           console.error(`falló la petición a la api con error: ${error.message}`);
    }
}


