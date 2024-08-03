$(document).ready(function () {
    // Maneja el evento de envío del formulario
    $('#searchForm').on('submit', function (e) {
        e.preventDefault();
        var heroId = $('#heroId').val().trim();

        // Validación del ID del héroe (Numérico)
        if (!$.isNumeric(heroId)) {
            alert('Por favor, ingresa un número válido.');
            return;
        }

        // Solicitud AJAX para obtener datos del héroe
        $.ajax({
            url: `https://www.superheroapi.com/api.php/ce13c369a54833268ef9e467b69ba5ea/${heroId}`,
            type: 'GET',
            success: function (data) {
                if (data.response === 'success') {
                    updateHeroInfo(data);
                    updateChart(data);
                    $('#heroResult').show();
                } else {
                    alert('No se encontró el SuperHero.');
                }
            },
            error: function () {
                alert('Error al realizar la búsqueda.');
            }
        });
    });

    // Actualiza la información del héroe en la tarjeta
    function updateHeroInfo(data) {
        $('#heroImage').attr('src', data.image.url);
        $('#heroName').text(data.name);
        $('#heroConnections').text(data.connections['group-affiliation']);
        $('#heroPublisher').text(data.biography.publisher);
        $('#heroOccupation').text(data.work.occupation);
        $('#heroFirstAppearance').text(data.biography['first-appearance']);
        $('#heroHeight').text(data.appearance.height.join(' / '));
        $('#heroWeight').text(data.appearance.weight.join(' / '));
        $('#heroAlliances').text(data.connections.relatives);
    }

    // Actualiza el gráfico con los datos del héroe
    function updateChart(data) {
        var chartOptions = {
            title: {
                text: `Estadísticas de poder para ${data.name}`
            },
            data: [{
                type: "pie",
                startAngle: 45,
                showInLegend: "true",
                legendText: "{label}",
                indexLabel: "{label} ({y})",
                yValueFormatString: "#,##0.#" % "",
                dataPoints: [
                    { label: "Intelligence", y: parseInt(data.powerstats.intelligence) },
                    { label: "Strength", y: parseInt(data.powerstats.strength) },
                    { label: "Speed", y: parseInt(data.powerstats.speed) },
                    { label: "Durability", y: parseInt(data.powerstats.durability) },
                    { label: "Power", y: parseInt(data.powerstats.power) },
                    { label: "Combat", y: parseInt(data.powerstats.combat) }
                ]
            }]
        };
        $("#chartContainer").CanvasJSChart(chartOptions);
    }
});
