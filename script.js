function calcularMiraReal() {
  var dpi = document.getElementById("dpi").value;
  var hipfire = document.getElementById("hipfire").value;
  var mira = document.getElementById("mira").value;
  var multiplier = document.getElementById("multiplier").value;

  var hipfireCalculado = hipfire;
  if (multiplier == "0.002") {
    if (hipfire > 10) {
      hipfireCalculado = hipfire / 10;
    } else {
      hipfireCalculado = hipfire / 10;
    }
  }

  var miraCalculada = (mira / 58) * 100;

  var miraReal = ((miraCalculada / 100) * hipfireCalculado * dpi) / 100;
  var resultadoFormatado =
    miraReal % 1 === 0 ? Math.floor(miraReal) : miraReal.toFixed(2);

  document.getElementById("tituloResultado").style.display = "block";
  document.getElementById("resultado").style.display = "block";
  document.getElementById("resultado").innerText = resultadoFormatado;

  localStorage.setItem("dpi", dpi);
  localStorage.setItem("hipfire", hipfire);
  localStorage.setItem("mira", mira);
  localStorage.setItem("multiplier", multiplier);
  localStorage.setItem("miraReal", resultadoFormatado);
  localStorage.setItem("dpiColor", document.getElementById("dpi").style.color);
  localStorage.setItem(
    "hipfireColor",
    document.getElementById("hipfire").style.color
  );
  localStorage.setItem(
    "miraColor",
    document.getElementById("mira").style.color
  );
}

function validarValor(input) {
  var valor = Number(input.value);
  var min = Number(input.min);
  var max = Number(input.max);

  if (valor < min || valor > max || valor % 1 !== 0) {
    input.style.color = "red";
  } else {
    input.style.color = "green";
  }
}

document.getElementById("resultado").addEventListener("click", function () {
  var resultado = this.innerText;
  navigator.clipboard.writeText(resultado).then(
    function () {
      var notificacao = document.getElementById("notificacao");
      notificacao.innerText = "Mira Real copiada!";
      notificacao.style.display = "block";

      setTimeout(function () {
        notificacao.style.display = "none";
      }, 5000);
    },
    function () {
      alert("Falha ao copiar Mira Real!");
    }
  );
});

document
  .getElementById("multiplier")
  .addEventListener("change", calcularMiraReal);

window.onload = function () {
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
    document.getElementById("dpi").style.color =
      localStorage.getItem("dpiColor");
    document.getElementById("hipfire").style.color =
      localStorage.getItem("hipfireColor");
    document.getElementById("mira").style.color =
      localStorage.getItem("miraColor");
  }
};
