
let wins = 0;
let losses = 0;

async function play(playerChoice) {
    try {
       // console.log("El usuario ha elegido:", playerChoice);
        // Definir la lista de opciones para el computer
        const computerOptions = ["rock", "paper", "scissors", "dynamite", "tornado", "nuke", "monkey", "tank", "air", "airplane", "alien", "axe", "baby", "beer", "bicycle", "bird", "blood", "book", "bowl", "brain", "butter", "cage", "camera", "car"];

        // Obtener un índice aleatorio dentro del rango de la lista
        const randomIndex = Math.floor(Math.random() * computerOptions.length);
        const computerChoice = computerOptions[randomIndex];
       // console.log("El ordenador ha elegido:", computerChoice);

        // Realizar el request a la API
        const response = await fetch(`https://rps101.pythonanywhere.com/api/v1/match?object_one=${playerChoice}&object_two=${computerChoice}`);
        const data = await response.json();
        // Imprimir el JSON recibido en la consola
       // console.log("JSON recibido:", data);

        if (response.ok) {
            const winner = data.winner;
            const loser = data.loser;
            const outcome = data.outcome;
            const result = getResult(winner, loser, playerChoice);
          //  console.log(result);

            // Actualizar el contador de victorias y derrotas
            if (result === 'Ganaste') {
                wins++;
            } else if (result === 'Perdiste') {
                losses++;
            }

            // Mostrar el contador en la tabla
            updateCounterTable();

            // Llamar a la función para mostrar el resultado en la interfaz de usuario
            displayResult(result, winner, loser, computerChoice, outcome, playerChoice);
        } else {
            throw new Error('Failed to fetch data from API');
        }
    } catch (error) {
        console.error('Error fetching API:', error);
        displayError();
    }
}

function updateCounterTable() {
    const counterTable = document.getElementById('counter-table');
    counterTable.innerHTML = `
        <tr>
            <td>Ganadas:</td>
            <td>${wins}</td>
        </tr>
        <tr>
            <td>Perdidas:</td>
            <td>${losses}</td>
        </tr>
    `;
}


function getResult(winner, loser, playerChoice) {
   // console.log("Obtengo los siguientes valores:", winner, loser, playerChoice );
    if (playerChoice === winner) {
        return "Ganaste";
    } else if (playerChoice === loser) {
        return "Perdiste";
    } else {
        return "Empate";
    }
}

function displayResult(result, winner, loser, computerChoice, outcome, playerChoice) {
    const resultDiv = document.getElementById('result');
    let emoji, message, color;

    switch (result) {
        case 'Ganaste':
            color = 'gold';
            emoji = '😎';
            fetch('https://insult.mattbas.org/api/insult')
                .then(response => response.text())
                .then(data => {
                    const insult = data.trim();
                    resultDiv.innerHTML = `<p>${emoji} ¡${result}! ${insult}</p>`;
                    document.body.style.backgroundColor = color;
                });
            break;
        case 'Perdiste':
            color = 'red';
            emoji = '😔';
            message = `<p>${emoji} ${result}. ${computerChoice} ${outcome} ${playerChoice}.</p>`;
            resultDiv.innerHTML = message;
            document.body.style.backgroundColor = color;
            break;
        default:
            emoji = '🤝';
            message = `<p>${emoji} ${result}.</p>`;
            resultDiv.innerHTML = message;
            document.body.style.backgroundColor = 'black';
            break;
    }
}

function displayError() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = "<p>Hubo un error al comunicarse con el servidor. Por favor, intenta de nuevo más tarde.</p>";
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('reset-button').addEventListener('click', function() {
        // Reiniciar los contadores a cero
        wins = 0;
        losses = 0;

        // Actualizar la tabla de contadores
        updateCounterTable();
        
        // Ocultar los mensajes
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = "";

        // Restaurar el color de fondo a negro
        document.body.style.backgroundColor = 'black';
    });
});
