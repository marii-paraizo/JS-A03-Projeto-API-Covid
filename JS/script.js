// Grafico mapa
google.charts.load('current', {
    'packages': ['geochart'],
});
google.charts.setOnLoadCallback(desenharGraficoMapa);

function desenharGraficoMapa() {
    obterDados();
}

function obterDados() {
    let dados = [['País', 'Casos Confirmados']]; 

    // Busca os dados da API
    fetch('https://covid19-brazil-api.vercel.app/api/report/v1/countries')
    .then(response => response.json())
    .then(apiData => {
        // Adiciona os dados ao array
        apiData.data.forEach(item => {
            dados.push([item.country, item.confirmed || 0]); 
        });
        desenharGraficoMapaCompleto(dados); 
    })
}

function desenharGraficoMapaCompleto(dados) {
    let data = google.visualization.arrayToDataTable(dados);
    let options = { 
        title: "Casos Confirmados de COVID-19",
        colorAxis: {colors: ['#c4f4b8', '#5c974d']},
        backgroundColor: { fill: '#e2f4ff' } 
    };

    let chart = new google.visualization.GeoChart(document.getElementById('grafico-mapa'));
    chart.draw(data, options);
}

// Gráfico de pizza 
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(desenharGraficoPizza);

function desenharGraficoPizza() {
    // Fazer a requisição para obter os dados
    fetch('https://covid19-brazil-api.now.sh/api/report/v1/countries')
        .then(response => response.json())
        .then(data => {
            // Inicializar totais
            let totalConfirmados = 0;
            let totalMortos = 0;
            let totalRecuperados = 0;

            // Processar os dados para somar totais
            data.data.forEach(item => {
                totalConfirmados += item.confirmed;
                totalMortos += item.deaths;
                totalRecuperados += item.recovered;
            });

            // Criar os dados do gráfico
            let chartData = [
                ['Status', 'Total']
            ];

            chartData.push(['Confirmados', totalConfirmados])
            chartData.push(['Mortos', totalMortos])
            chartData.push(['Recuperados', totalRecuperados])
            console.table(chartData)
            
            // Converter o array para o formato do Google Charts
            let dataTable = google.visualization.arrayToDataTable(chartData);

            let options = {
                is3D: true
            };

            let chart = new google.visualization.PieChart(document.getElementById('grafico-pizza'));
            chart.draw(dataTable, options);
        })
}

// Gráfico de tabela 
google.charts.load('current', {'packages':['table']});
google.charts.setOnLoadCallback(desenharGraficoTabela);

function desenharGraficoTabela() {
    fetch('https://covid19-brazil-api.now.sh/api/report/v1')
    .then(response => response.json())
    .then(data => {
        // Inicializando a DataTable
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn('string', 'Sigla');
        dataTable.addColumn('string', 'Estado');
        dataTable.addColumn('number', 'Casos');
        dataTable.addColumn('number', 'Mortes');
        dataTable.addColumn('number', 'Suspeitos');
        dataTable.addColumn('number', 'Descartados');

        // Iterando pelos dados dos estados
        data.data.forEach(item => {
            dataTable.addRow([
                item.uf, // Sigla
                item.state, // Estado
                item.cases || 0, // Casos
                item.deaths || 0, // Mortes
                item.suspects || 0, // Suspeitos
                item.discarded || 0 // Descartados
            ]);
        });

        // Desenhando a tabela
        var table = new google.visualization.Table(document.getElementById('grafico-tabela'));
        table.draw(dataTable, {showRowNumber: true, width: '100%', height: '100%'});
    })
}