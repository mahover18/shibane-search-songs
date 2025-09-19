const sheetID = "1_b2-8DdZzCTkCKatbWXpmwHLuMavenZaNXAY_x-XDSc";
const gid = "0"; // シートのGID（デフォルトは0）

function search() {
	const title = document.getElementById("title").value;
	const artist = document.getElementById("artist").value;
	const genre = document.getElementById("genre").value;
	const play = document.getElementById("play").value;
	const detail = document.getElementById("detail").value;

	const query = `SELECT A, B, C WHERE B CONTAINS '${title}' AND C CONTAINS '${artist}' AND D CONTAINS '${genre}' AND E CONTAINS '${play}' AND F CONTAINS '${detail}' AND D IS NOT NULL ORDER BY C`
	const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?gid=${gid}&tq=${encodeURIComponent(query)}`;

	fetch(url)
		.then(res => res.text())
		.then(text => {
			const json = JSON.parse(text.substr(47).slice(0, -2)); // gvizの形式を整形
			const rows = json.table.rows;
			const headers = json.table.cols.map(col => col.label);

			const thead = document.querySelector("#resultTable thead");
			const tbody = document.querySelector("#resultTable tbody");
			thead.innerHTML = "<tr>" + headers.map(h => `<th>${h}</th>`).join("") + "</tr>";
			tbody.innerHTML = rows.map(row => {
				return "<tr>" + row.c.map(cell => `<td>${cell ? cell.v : ""}</td>`).join("") + "</tr>";
			}).join("");

			// 各セルに長押しでテキスト選択
			const tds = tbody.querySelectorAll("td");
			tds.forEach(td => {
				let timer = null;
				td.addEventListener('touchstart', function(e) {
					timer = setTimeout(() => {
						const range = document.createRange();
						range.selectNodeContents(td);
						const sel = window.getSelection();
						sel.removeAllRanges();
						sel.addRange(range);
					}, 500); // 500ms長押しで発動
				});
				td.addEventListener('touchend', function(e) {
					clearTimeout(timer);
				});
				td.addEventListener('touchmove', function(e) {
					clearTimeout(timer);
				});
			});

		})
		.catch(err => alert("検索に失敗しました: " + err));
}

if ('serviceWorker' in navigator) {
	window.addEventListener('load', function () {
		navigator.serviceWorker.register('service-worker.js').then(function (registration) {
			console.log('ServiceWorker registration successful with scope: ', registration.scope);
		}, function (err) {
			console.log('ServiceWorker registration failed: ', err);
		});
	});
}
