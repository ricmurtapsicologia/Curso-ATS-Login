// Lista de matrículas válidas
const matriculasValidas = [
    "1368646", "1359843", "1430750", "1605971", "1603687", "1613892"
    // Continue com sua lista...
];

function verificarMatricula() {
    const matriculaInput = document.getElementById("matricula").value.trim();
    const mensagemErro = document.getElementById("mensagem");

    if (matriculasValidas.includes(matriculaInput)) {
        window.location.href = "https://ricmurtapsicologia.github.io/Curso-ATS/";
    } else {
        mensagemErro.style.display = "block";
    }
}
