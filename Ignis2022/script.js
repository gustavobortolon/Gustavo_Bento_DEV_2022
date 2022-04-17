const enviarTimes = document.querySelector("#enviarTimes");
const timesRodadas = document.querySelector("#rodadas");
const colocacaoTimes = document.querySelector("#classificacao");

const pegarTimes = () => {
    let times = document.querySelector("#pegarTimes").value;
    times = times.trim();
    return times;
}

const criarRodadas = () => {
    const fazerRodadas = Object.keys(participantes).length * 2;
    const rodadas = [];
    for (let i = 1; i <= fazerRodadas; i++) {
        rodadas.push([[]]);
    }
    return rodadas;
}

const times = (rodadas, j, k, jogo) => {
    for (let i = 0; i < rodadas.length; i++) {
        let rodada = rodadas[i];
        if (rodada[0].includes(j) || rodada[0].includes(k)) {} 
        else {
            rodada[0] += `${k} ${j}`;
            rodada.push(jogo);
            return rodada;
        }
    }
}

const ordemRodadas = () => {
    const rodadas = criarRodadas();
    for (let j of Object.keys(participantes)) {
        for (let k of Object.keys(participantes)) {
            if (j !== k) {
                let casa = participantes[k].casa;
                let jogo = [j, k, casa];
                times(rodadas, j, k, jogo);
            }
        }
    }
    return rodadas;
};

const rodadaDupla = (rodadas) => {
    for (let i = 0; i < rodadas.length; i++) {
        let dupla = {}
        for (let j = 1; j < rodadas[i].length; j++) {
            let jogo = rodadas[i][j]
            if (Object.keys(dupla).includes(jogo[2])) {dupla[jogo[2]] += 1}
            else { dupla[jogo[2]] = 1 }
        }
        for (let rDupla of Object.keys(dupla)) {
            if (rDupla[dupla] > 1) {let jogos = []
                for (let jogo of rodadas[i]) {
                    if (jogo.includes(rDupla)) {jogo.push('(Rodada Dupla)')}
                    jogos.push(jogo)
                    rodadas[i] = jogos
                }
            }
        }
    }
    return rodadas
}

const sortearCampeao = (rodadas) => {
    for (let rodada of rodadas) {
        for (let i = 1; i < rodada.length; i++) {let resultado = Math.floor(Math.random() * 3)
            if (resultado == 0) {participantes[rodada[i][0]]["pontos"] += 3} 
            else if (resultado == 1) {participantes[rodada[i][1]]["pontos"] += 3}
            else if (resultado == 2) 
                {participantes[rodada[i][0]]["pontos"] += 1
                participantes[rodada[i][1]]["pontos"] += 1}
        }
    }
    return rodadas
}

const criarTimesRodadas = (rodadas) => {
    for (let i = 1; i < rodadas.length; i++) {
        let rodada = document.createElement("div");
        let espaco = document.createElement("hr");
        espaco.innerText = `Rodada `+ i; 
        rodada.appendChild(espaco);

        for (let k = 1; k < rodadas[i].length; k++) {
            let jogo = rodadas[i][k];
            let rodadaParagrafo = document.createElement("p");
            let paragrafo = `${jogo[0]} vs ${jogo[1]} - ${jogo[2]
                } - Rodada ${i + 1}`

            if (jogo[3]) {paragrafo = `${paragrafo} ${jogo[3]}`}
            rodadaParagrafo.innerText = paragrafo;
            rodada.appendChild(rodadaParagrafo);
        }
        timesRodadas.appendChild(rodada);
    }
}

const criaPontuacao = () => {
    pontuacao = {}
    for (let time of Object.keys(participantes)) {
        pontuacao[time] = participantes[time].pontos}

    return pontuacao
}

const preenchePontuacao = (pontuacao) => {
    colocacaoTimes.inneHTML = ""
    for(let i = 0; i < pontuacao.length; i++) {
        let jogo = document.createElement("p");
        jogo.innerText = `${pontuacao[i][0]} - ${pontuacao[i][1]} pontos`
        colocacaoTimes.appendChild(jogo)
    }
}

const enviandoTimes = () => {
    timesRodadas.innerHTML = "";
    participantes = {};
    recebeTimes = pegarTimes();
    
    const separar = recebeTimes.split(/\n/);
    
    for (let palavras of separar) {
        const lista = palavras.split(";");
        participantes[lista[0]] = {
            casa: lista[1],
            pontos: 0
        }
    }
    
    let rodadas = ordemRodadas();
    rodadas = rodadaDupla(rodadas);
    sortearCampeao(rodadas);
    criarTimesRodadas(rodadas);
    
    let pontuacao = criaPontuacao()
    pontuacao = Object.entries(pontuacao).sort((a,b) => b[1] - a[1])
    preenchePontuacao(pontuacao);
}

enviarTimes.addEventListener("click", enviandoTimes);