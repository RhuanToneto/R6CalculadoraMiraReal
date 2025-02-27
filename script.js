function calcularMiraReal() {
    var dpi = Number(document.getElementById("dpi").value);
    var hipfire = Number(document.getElementById("hipfire").value);
    var mira = Number(document.getElementById("mira").value);
    var multiplier = document.getElementById("multiplier").value;

    var hipfireAjustado = multiplier === "0.002" ? hipfire / 10 : hipfire;
    
    var fatorMira = mira / 58;  
    var miraReal = (fatorMira * hipfireAjustado * dpi) / 100;
    
    var resultadoFormatado = miraReal % 1 === 0 ? Math.floor(miraReal) : miraReal.toFixed(2);

    document.getElementById("tituloResultado").style.display = "block";
    document.getElementById("resultado").style.display = "block";
    document.getElementById("resultado").innerText = resultadoFormatado;

    localStorage.setItem("dpi", dpi);
    localStorage.setItem("hipfire", hipfire);
    localStorage.setItem("mira", mira);
    localStorage.setItem("multiplier", multiplier);
    localStorage.setItem("miraReal", resultadoFormatado);
    localStorage.setItem("dpiColor", document.getElementById("dpi").style.color);
    localStorage.setItem("hipfireColor", document.getElementById("hipfire").style.color);
    localStorage.setItem("miraColor", document.getElementById("mira").style.color);
}

function validarValor(input) {
    var valor = input.value;
    var numeroValor = Number(valor);
    var min = Number(input.min);
    var max = Number(input.max);
    var errorMessage = input.parentElement.querySelector('.error-message');
    
    if (errorMessage) {
        errorMessage.remove();
    }

    if (valor.startsWith('0') && valor.length > 1 || valor < min || valor > max || valor % 1 !== 0) {
        input.style.color = "red";
        
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
    
    verificarECalcular();
}

function verificarECalcular() {
    var dpi = document.getElementById("dpi");
    var hipfire = document.getElementById("hipfire");
    var mira = document.getElementById("mira");
    var multiplier = document.getElementById("multiplier");
    var errorMessage = multiplier.parentElement.querySelector('.error-message');

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

    if (!multiplier.value) {
        if (errorMessage) {
            errorMessage.remove();
        }
        
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
        calcularMiraReal();
    }
}

window.onload = function() {
    var dpi = localStorage.getItem("dpi");
    var hipfire = localStorage.getItem("hipfire");
    var mira = localStorage.getItem("mira");
    var multiplier = localStorage.getItem("multiplier");
    var miraReal = localStorage.getItem("miraReal");

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

    document.getElementById("dpi").addEventListener("input", validarValor);
    document.getElementById("hipfire").addEventListener("input", validarValor);
    document.getElementById("mira").addEventListener("input", validarValor);
    document.getElementById("multiplier").addEventListener("change", verificarECalcular);

    const multiplierSelect = document.getElementById("multiplier");
    if (!multiplierSelect.value) {
        multiplierSelect.classList.add('nao-selecionado');
    }
    
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

function copyTextToClipboard(text) {
    var tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    alert("Mira Real copiada: " + text);
}

resultadoElement.addEventListener("click", function() {
    copyTextToClipboard(resultadoElement.innerText);
});

resultadoElement.addEventListener("touchstart", function(event) {
    event.preventDefault();
    copyTextToClipboard(resultadoElement.innerText);
});

document.getElementById('currentYear').textContent = new Date().getFullYear();