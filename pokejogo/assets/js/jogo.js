var velocidade = 1
var jogoIniciado = false
var record = localStorage.getItem("record")

if(record === null){
    record = 0
}

document.querySelector("#record").innerHTML = record

const musica = document.querySelector("#musica")
const somDano = document.querySelector("#somDano")
const somPulo = document.querySelector("#somPulo")

const cenario = {
    left: 0,
    jogo: document.querySelector("#jogo"),

    movimentar(){
        this.left = this.left - velocidade
        this.jogo.style.backgroundPositionX = this.left + "px"
    },

    verificarGameOver(){
        if(personagem.vidas <= 0){
            jogoIniciado = false
            musica.pause()
            document.querySelector("#pontosGameOver").innerHTML = personagem.pontos
            document.querySelector("#telaGameOver").style.display = "flex"
        }
    }
}

const vilao = {
    right: -153,
    item: document.querySelector("#vilao"),

    movimentar(){
        this.right = this.right + (velocidade * 1.7)
        this.item.style.right = this.right + "px"

        var larguraJogo = cenario.jogo.offsetWidth

        if(larguraJogo < this.right){
            this.right = -153
            personagem.pontos = personagem.pontos + 10

            if(personagem.pontos === 80){
                this.item.style.backgroundImage = "url('assets/img/vilao2.png')"
            }

            if(personagem.pontos === 100){
                cenario.jogo.style.backgroundImage = "url('assets/img/cenario2.png')"
            }

            if(personagem.pontos === 150){
                personagem.limitePulos = 2
            }

            if(personagem.pontos === 160){
                this.item.style.backgroundImage = "url('assets/img/vilao3.png')"
            }

            if(personagem.pontos === 200){
                cenario.jogo.style.backgroundImage = "url('assets/img/cenario3.png')"
                personagem.item.style.backgroundImage = "url('assets/img/jogador2.png')"
            }

            if(personagem.pontos === 240){
                this.item.style.backgroundImage = "url('assets/img/vilao4.png')"
            }

            if(personagem.pontos === 300){
                cenario.jogo.style.backgroundImage = "url('assets/img/cenario4.png')"
            }

            if(personagem.pontos > record){
                record = personagem.pontos
                localStorage.setItem("record", record)
                document.querySelector("#record").innerHTML = record
            }

            if(personagem.pontos % 50 === 0 && velocidade < 4){
                velocidade = velocidade + 0.5
            }

            document.querySelector("#pontos").innerHTML = personagem.pontos
        }
    },

    colisao(){
        var posicaoJogador = personagem.item.getBoundingClientRect()
        var posicaoVilao = this.item.getBoundingClientRect()

        if(
            posicaoJogador.left < posicaoVilao.left &&
            posicaoJogador.right > posicaoVilao.left &&
            posicaoJogador.bottom > posicaoVilao.top &&
            posicaoJogador.top <= posicaoVilao.top
        ){
            personagem.vidas = personagem.vidas - 1

            somDano.pause()
            somDano.currentTime = 0.71
            somDano.play()

            if(personagem.vidas === 2){
                document.querySelector("#vida3").style.display = "none"
            }

            if(personagem.vidas === 1){
                document.querySelector("#vida2").style.display = "none"
            }

            if(personagem.vidas === 0){
                document.querySelector("#vida1").style.display = "none"
            }

            this.right = -153
            this.item.style.right = "-153px"

            personagem.left = 200
            personagem.bottom = 70
            personagem.velocidadeY = 0
            personagem.pulos = 0
            personagem.item.style.left = "200px"
            personagem.item.style.bottom = "70px"
        }
    }
}

const personagem = {
    pontos: 0,
    vidas: 3,
    left: 200,
    bottom: 70,
    velocidadeY: 0,
    forcaPulo: 8.2,
    gravidade: 0.12,
    pulos: 0,
    limitePulos: 1,
    esquerda: false,
    direita: false,
    velocidadeMovimento: 3,
    item: document.querySelector("#personagem"),

    movimentar(){
        if(this.esquerda === true && this.left > 0){
            this.left = this.left - this.velocidadeMovimento
        }

        if(this.direita === true && this.left < cenario.jogo.offsetWidth - 153){
            this.left = this.left + this.velocidadeMovimento
        }

        this.item.style.left = this.left + "px"

        if(this.bottom > 70 || this.velocidadeY > 0){
            this.bottom = this.bottom + this.velocidadeY
            this.velocidadeY = this.velocidadeY - this.gravidade
        }

        if(this.bottom <= 70){
            this.bottom = 70
            this.velocidadeY = 0
            this.pulos = 0
        }

        this.item.style.bottom = this.bottom + "px"
    },

    pular(){
        if(this.pulos < this.limitePulos){
            this.velocidadeY = this.forcaPulo
            this.pulos = this.pulos + 1
            return true
        }

        return false
    }
}

setInterval(function(){
    if(jogoIniciado === true){
        cenario.movimentar()
        vilao.movimentar()
        personagem.movimentar()
        vilao.colisao()
        cenario.verificarGameOver()
    }
}, 10)

document.addEventListener("keydown", function(event){
    if(jogoIniciado === true){
        if(event.code === "ArrowLeft"){
            personagem.esquerda = true
        }

        if(event.code === "ArrowRight"){
            personagem.direita = true
        }

        if(event.code === "Space" && event.repeat === false){
            if(personagem.pular() === true){
                somPulo.pause()
                somPulo.currentTime = 0.56
                somPulo.play()
            }
        }
    }
})

document.addEventListener("keyup", function(event){
    if(event.code === "ArrowLeft"){
        personagem.esquerda = false
    }

    if(event.code === "ArrowRight"){
        personagem.direita = false
    }
})

document.querySelector("#btnComecar").addEventListener("click", function(){
    jogoIniciado = true
    document.querySelector("#telaInicio").style.display = "none"
    personagem.item.style.visibility = "visible"
    vilao.item.style.visibility = "visible"

    musica.currentTime = 0
    musica.play()
})

document.querySelector("#btnReiniciar").addEventListener("click", function(){
    personagem.pontos = 0
    personagem.vidas = 3
    personagem.left = 200
    personagem.bottom = 70
    personagem.velocidadeY = 0
    personagem.pulos = 0
    personagem.limitePulos = 1
    personagem.esquerda = false
    personagem.direita = false
    personagem.item.style.left = "200px"
    personagem.item.style.bottom = "70px"
    personagem.item.style.backgroundImage = "url('assets/img/jogador.png')"

    vilao.right = -153
    vilao.item.style.right = "-153px"
    vilao.item.style.backgroundImage = "url('assets/img/vilao.png')"

    velocidade = 1

    cenario.left = 0
    cenario.jogo.style.backgroundPositionX = "0px"
    cenario.jogo.style.backgroundImage = "url('assets/img/cenario.png')"

    document.querySelector("#pontos").innerHTML = 0
    document.querySelector("#vida1").style.display = "inline"
    document.querySelector("#vida2").style.display = "inline"
    document.querySelector("#vida3").style.display = "inline"
    document.querySelector("#telaGameOver").style.display = "none"

    musica.currentTime = 0
    musica.play()

    jogoIniciado = true
})