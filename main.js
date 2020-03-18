(() => {
  const calc = () => {
    document.querySelector('#infected-now').innerText = calcInfected(0);
    document.querySelector('#result').style.display = 'block';
    document.querySelector('#hint').style.display = 'block';
    document.querySelectorAll('#settings .row').forEach(row => {
      row.style.display = 'flex';
    });

    const chartData = [];
    const chartLabels = [];
    for (let index = -daysToDeath; index <= daysToDeath; index++) {
      if (index === 0) {
        chartLabels.push('TODAY');
      } else if (index === -1) {
        chartLabels.push('yesterday');
      } else if (index === 1) {
        chartLabels.push('tomorrow');
      } else if (index < -1) {
        chartLabels.push(index + ' days');
      } else {
        chartLabels.push('+' + index + ' days');
      }
      chartData.push(calcInfected(-index));
    }
    if (chart) chart.destroy();
    chart = new window.Chart(
      document.querySelector('canvas').getContext('2d'),
      {
        type: 'line',
        data: {
          labels: chartLabels,
          datasets: [
            {
              data: chartData,
              borderColor: '#60b8ff',
              backgroundColor: 'rgba(97, 184, 255, 0.3)'
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
          maintainAspectRatio: false
        }
      }
    );
  };

  const calcInfected = daysAgo => {
    const infectedPast = deaths / deathRate;
    const doublings = (daysToDeath - daysAgo) / doublingTime;
    return Math.round(infectedPast * Math.pow(2, doublings));
  };

  let deaths = null;
  let deathRate = null;
  let daysToDeath = null;
  let doublingTime = null;
  let chart = null;

  window.addEventListener('submit', e => {
    e.preventDefault();

    // Get form data
    deaths = e.target.querySelector('#deaths').value;
    deathRate = e.target.querySelector('#death-rate').value / 100;
    daysToDeath = e.target.querySelector('#day-to-death').value;
    doublingTime = e.target.querySelector('#doubling-time').value;

    // Calc and update chart
    calc();
  });

  document.querySelector('#deaths').select();
})();
