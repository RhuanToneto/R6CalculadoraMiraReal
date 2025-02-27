/**
 * Calcula a Mira Real baseada nos valores inseridos pelo usuário.
 * A fórmula considera DPI, sensibilidade, multiplicador e sensibilidade da mira 1.0x.
 */
function calcularMiraReal() {
    var dpi = Number(document.getElementById("dpi").value);
    var hipfire = Number(document.getElementById("hipfire").value);
    var mira = Number(document.getElementById("mira").value);
    var multiplier = document.getElementById("multiplier").value;

    var hipfireAjustado;
    
    // Ajusta o valor da sensibilidade com base no multiplicador selecionado
    switch(multiplier) {
        case "0.002":
            hipfireAjustado = hipfire / 10;
            break;
        case "0.01":
            hipfireAjustado = hipfire / 2;
            break;
        case "0.02":
            hipfireAjustado = hipfire;
            break;
    }
    
    // Fator 58 é um valor de referência para a mira padrão no R6
    var fatorMira = mira / 58;  
    var miraReal = (fatorMira * hipfireAjustado * dpi) / 100;
    
    // Formata o resultado: números inteiros sem decimal, outros com 2 casas
    var resultadoFormatado = miraReal % 1 === 0 ? Math.floor(miraReal) : miraReal.toFixed(2);

    // Exibe o resultado na tela
    document.getElementById("tituloResultado").style.display = "block";
    document.getElementById("resultado").style.display = "block";
    document.getElementById("resultado").innerText = resultadoFormatado;

    // Salva os valores e estados no localStorage para persistência
    localStorage.setItem("dpi", dpi);
    localStorage.setItem("hipfire", hipfire);
    localStorage.setItem("mira", mira);
    localStorage.setItem("multiplier", multiplier);
    localStorage.setItem("miraReal", resultadoFormatado);
    localStorage.setItem("dpiColor", document.getElementById("dpi").style.color);
    localStorage.setItem("hipfireColor", document.getElementById("hipfire").style.color);
    localStorage.setItem("miraColor", document.getElementById("mira").style.color);
}

/**
 * Valida se o valor inserido está dentro dos limites permitidos
 * e exibe mensagens de erro quando necessário.
 * @param {HTMLElement} input - Elemento de entrada a ser validado
 */
function validarValor(input) {
    var valor = input.value;
    var numeroValor = Number(valor);
    var min = Number(input.min);
    var max = Number(input.max);
    var errorMessage = input.parentElement.querySelector('.error-message');
    
    // Remove mensagens de erro anteriores
    if (errorMessage) {
        errorMessage.remove();
    }

    // Verifica se o valor é válido e exibe mensagem de erro se necessário
    if (valor.startsWith('0') && valor.length > 1 || valor < min || valor > max || valor % 1 !== 0) {
        input.style.color = "red";
        
        // Cria e posiciona a mensagem de erro
        errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = input.dataset.error;
        input.parentElement.appendChild(errorMessage);
        errorMessage.style.display = 'block';
        
        var inputRect = input.getBoundingClientRect();
        errorMessage.style.top = `${inputRect.bottom + 5}px`;
        errorMessage.style.left = `${inputRect.left}px`;
    } else {
        input.style.color = "green";
    }
    
    // Verifica se todos os campos estão válidos para calcular
    verificarECalcular();
}

/**
 * Verifica se todos os campos necessários estão preenchidos e válidos
 * para então calcular a Mira Real.
 */
function verificarECalcular() {
    var dpi = document.getElementById("dpi");
    var hipfire = document.getElementById("hipfire");
    var mira = document.getElementById("mira");
    var multiplier = document.getElementById("multiplier");
    var errorMessage = multiplier.parentElement.querySelector('.error-message');

    // Verifica se todos os inputs estão válidos
    var todosInputsValidos = dpi.value && hipfire.value && mira.value && 
                            dpi.style.color === "green" && 
                            hipfire.style.color === "green" && 
                            mira.style.color === "green";

    if (!todosInputsValidos) {
        if (errorMessage) {
            errorMessage.remove();
        }
        document.getElementById("tituloResultado").style.display = "none";
        document.getElementById("resultado").style.display = "none";
        return;
    }

    // Verifica se o multiplicador foi selecionado
    if (!multiplier.value) {
        if (errorMessage) {
            errorMessage.remove();
        }
        
        // Cria e posiciona a mensagem de erro para o multiplicador
        errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = "Selecione um multiplicador";
        multiplier.parentElement.appendChild(errorMessage);
        errorMessage.style.display = 'block';
        
        var inputRect = multiplier.getBoundingClientRect();
        errorMessage.style.top = `${inputRect.bottom + 5}px`;
        errorMessage.style.left = `${inputRect.left}px`;
    } else {
        if (errorMessage) {
            errorMessage.remove();
        }
        // Calcula a Mira Real se tudo estiver válido
        calcularMiraReal();
    }
}

/**
 * Inicializa a página e restaura os valores salvos anteriormente.
 * Configura os eventos para os campos de entrada.
 */
window.onload = function() {
    // Recupera valores salvos do localStorage
    var dpi = localStorage.getItem("dpi");
    var hipfire = localStorage.getItem("hipfire");
    var mira = localStorage.getItem("mira");
    var multiplier = localStorage.getItem("multiplier");
    var miraReal = localStorage.getItem("miraReal");

    // Restaura os valores se existirem
    if (dpi && hipfire && mira && multiplier && miraReal) {
        document.getElementById("dpi").value = dpi;
        document.getElementById("hipfire").value = hipfire;
        document.getElementById("mira").value = mira;
        document.getElementById("multiplier").value = multiplier;
        document.getElementById("resultado").innerText = miraReal;
        document.getElementById("tituloResultado").style.display = "block";
        document.getElementById("resultado").style.display = "block";
        document.getElementById("dpi").style.color = localStorage.getItem("dpiColor");
        document.getElementById("hipfire").style.color = localStorage.getItem("hipfireColor");
        document.getElementById("mira").style.color = localStorage.getItem("miraColor");
    }

    // Adiciona os eventos de validação aos campos
    document.getElementById("dpi").addEventListener("input", validarValor);
    document.getElementById("hipfire").addEventListener("input", validarValor);
    document.getElementById("mira").addEventListener("input", validarValor);
    document.getElementById("multiplier").addEventListener("change", verificarECalcular);

    // Configura o estilo do seletor de multiplicador
    const multiplierSelect = document.getElementById("multiplier");
    if (!multiplierSelect.value) {
        multiplierSelect.classList.add('nao-selecionado');
    }
    
    // Adiciona eventos para controle visual do estado do seletor
    multiplierSelect.addEventListener('change', function() {
        if (this.value) {
            this.classList.remove('nao-selecionado');
        } else {
            this.classList.add('nao-selecionado');
        }
    });

    multiplierSelect.addEventListener('focus', function() {
        if (!this.value) {
            this.classList.add('nao-selecionado');
        }
    });

    // Configura tooltip para os campos numéricos
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.setAttribute('data-tooltip', 'true');
        });
        
        input.addEventListener('blur', function() {
            this.removeAttribute('data-tooltip');
            const errorMessage = this.parentElement.querySelector('.error-message');
            if (errorMessage && this.style.color === 'green') {
                errorMessage.remove();
            }
        });
    });
};

var resultadoElement = document.getElementById("resultado");

/**
 * Copia o texto para a área de transferência usando uma estratégia compatível
 * com a maioria dos navegadores.
 * @param {string} text - Texto a ser copiado
 */
function copyTextToClipboard(text) {
    var tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    alert("Mira Real copiada: " + text);
}

// Configura eventos para copiar o resultado ao clicar
resultadoElement.addEventListener("click", function() {
    copyTextToClipboard(resultadoElement.innerText);
});

// Configura eventos para dispositivos touch
resultadoElement.addEventListener("touchstart", function(event) {
    event.preventDefault();
    copyTextToClipboard(resultadoElement.innerText);
});

// Atualiza o ano no rodapé
document.getElementById('currentYear').textContent = new Date().getFullYear();