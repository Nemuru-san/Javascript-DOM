const buku = [];
const RENDER_EVENT = 'render-dataBuku';
const SAVED_EVENT = 'simpan-buku';
const STORAGE_KEY = 'bookshelf_app';

function isStorageExist() {
	if (typeof Storage === undefined) {
		alert('browser anda tidak mendukung localstorage');
		return false;
	}
	return true;
}

// fungsi
function tambahBuku() {
	const title = document.getElementById('judulBuku');
	const author = document.getElementById('penulis');
	const year = document.getElementById('tahunTerbit');
	const isRead = document.getElementById('isRead');
	let statusBook;

	if (isRead.checked) {
		statusBook = true;
		swal('Berhasil', 'anda sudah tamat membaca', 'success');
	} else {
		statusBook = false;
		swal('Berhasil', 'Buku baru sudah ditambahkan ke rak', 'success');
	}

	buku.push({
		id: +new Date(),
		judulBuku: title.value,
		penulis: author.value,
		tahunTerbit: Number(year.value),
		isComplete: statusBook,
	});

	title.value = null;
	author.value = null;
	year.value = null;
	isRead.checked = false;

	document.dispatchEvent(new Event(RENDER_EVENT));

	saveData();
}

function tampilkanBuku(bukuObject) {
	const textTitle = document.createElement('h2');
	textTitle.innerHTML = `${bukuObject.judulBuku} <span>(${bukuObject.tahunTerbit})</span>`;

	const textAuthor = document.createElement('p');
	textAuthor.innerText = 'Author : ' + bukuObject.penulis;

	const textContainer = document.createElement('div');
	textContainer.classList.add('inner');
	textContainer.append(textTitle, textAuthor);

	const container = document.createElement('div');
	container.classList.add('item');
	container.append(textContainer);
	container.setAttribute('id', `buku-${bukuObject.id}`);

	if (bukuObject.isComplete) {
		const refreshButton = document.createElement('button');
		refreshButton.classList.add('refresh-btn');
		refreshButton.innerHTML = `<i class="fi fi-br-refresh"></i>`;
		refreshButton.addEventListener('click', function () {
			refreshDataBuku(bukuObject.id);
		});

		const removeButton = document.createElement('button');
		removeButton.classList.add('remove-btn');
		removeButton.innerHTML = `<i class="fi fi-br-trash"></i>`;
		removeButton.addEventListener('click', function () {
			removeDataBuku(bukuObject.id);
		});

		container.append(refreshButton, removeButton);
	} else {
		const finishButton = document.createElement('button');
		finishButton.classList.add('finish-btn');
		finishButton.innerHTML = `<i class="fi fi-br-check"></i>`;
		finishButton.addEventListener('click', function () {
			finishDataBuku(bukuObject.id);
		});

		container.append(finishButton);
	}

	return container;
}

function finishDataBuku(bukuId) {
	const target = cariBuku(bukuId);

	if (target == null) return;
	target.isComplete = true;
	document.dispatchEvent(new Event(RENDER_EVENT));

	swal('Luar biasa..', 'Anda telah selesai membaca buku ini');

	saveData();
}

function removeDataBuku(bukuId) {
	const target = cariIndexBuku(bukuId);
	swal({
		title: 'Apakah Anda Yakin?',
		text: 'Item buku yang adan pilih akan di hapus',
		icon: 'warning',
		buttons: true,
		dangerMode: true,
	}).then((willDelete) => {
		if (willDelete) {
			buku.splice(target, 1);
			document.dispatchEvent(new Event(RENDER_EVENT));
			saveData();

			swal('Berhasil', 'Buku yang anda pilih berhasil di hapus', 'success');
		} else {
			swal('Buku tidak jadi dihapus');
		}
	});
}

function refreshDataBuku(bukuId) {
	const target = cariBuku(bukuId);

	if (target == null) return;
	target.isComplete = false;
	document.dispatchEvent(new Event(RENDER_EVENT));

	swal('Luar biasa..', 'Anda telah mengembalikan buku ini');

	saveData();
}

function clearAll() {
	swal({
		title: 'Apakah Anda Yakin?',
		text: 'Item buku yang adan pilih akan di hapus',
		icon: 'warning',
		buttons: true,
		dangerMode: true,
	}).then((willDelete) => {
		if (willDelete) {
			buku.splice(0, buku.length);
			document.dispatchEvent(new Event(RENDER_EVENT));
			saveData();

			swal('Berhasil', 'Buku yang anda pilih berhasil di hapus', 'success');
		} else {
			swal('Buku tidak jadi dihapus');
		}
	});
}

function cariBuku(bukuId) {
	for (const itemBuku of buku) {
		if (itemBuku.id === bukuId) {
			return itemBuku;
		}
	}
	return null;
}

function cariIndexBuku(bukuId) {
	for (const index in buku) {
		if (buku[index].id === bukuId) {
			return index;
		}
	}

	return -1;
}

function saveData() {
	if (isStorageExist()) {
		const parsed = JSON.stringify(buku);
		localStorage.setItem(STORAGE_KEY, parsed);
		document.dispatchEvent(new Event(SAVED_EVENT));
	}
}

function loadDataStorage() {
	const serialData = localStorage.getItem(STORAGE_KEY);
	let data = JSON.parse(serialData);

	if (data !== null) {
		for (const item of data) {
			buku.push(item);
		}
	}

	document.dispatchEvent(new Event(RENDER_EVENT));
}

function pencarianBuku() {
	const input = document.getElementById('cariBuku').value.toLowerCase();
	const belumTerbaca = document.getElementById('belumBaca');
	const tamat = document.getElementById('selesaiBaca');

	belumTerbaca.innerHTML = '';
	tamat.innerHTML = '';

	if (input == '') {
		document.dispatchEvent(new Event(RENDER_EVENT));
		return;
	}

	for (const bukuItem of buku) {
		if (bukuItem.judulBuku.toLowerCase().includes(input)) {
			if (bukuItem.isComplete == false) {
				let elemen = `
                <div class="list-item" id="selesaiBaca">
                    <div class="item">
                        <div class="inner">
                            <h2>${bukuItem.judulBuku}</h3>
                            <p>Penulis : ${bukuItem.penulis}</p>
                            <p>Tahun Terbit : ${bukuItem.tahunTerbit}</p>
                            <p> status: belum selesai di baca</p>
                        </div>
                    </div>
                </div>
                `;

				swal('Selamat', 'Data buku ditemukan', 'success');
				belumTerbaca.innerHTML += elemen;
			} else {
				let elemen = `
                <div class="list-item" id="selesaiBaca">
                    <div class="item">
                        <div class="inner">
                            <h2>${bukuItem.judulBuku}</h3>
                            <p>Penulis : ${bukuItem.penulis}</p>
                            <p>Tahun Terbit : ${bukuItem.tahunTerbit}</p>
                            <p> status: sudah selesai di baca</p>
                        </div>
                    </div>
                </div>
                `;

				swal('Selamat', 'Data buku ditemukan', 'success');
				tamat.innerHTML += elemen;
			}
		}
	}
}

document.addEventListener('DOMContentLoaded', function () {
	const submitButton = document.getElementById('form-dataBuku');
	submitButton.addEventListener('submit', function (event) {
		event.preventDefault();
		tambahBuku();
	});

	const searchButton = document.getElementById('form-cariBuku');
	searchButton.addEventListener('submit', function (event) {
		event.preventDefault();
		pencarianBuku();
	});

	const resetBtn = document.querySelector('.reset-btn');
	resetBtn.addEventListener('click', () => {
		document.getElementById('cariBuku').value = '';
		pencarianBuku();
	});

	if (isStorageExist()) {
		loadDataStorage();
	}
});

document.addEventListener(RENDER_EVENT, function () {
	console.log(buku);

	const belumTerbaca = document.getElementById('belumBaca');
	belumTerbaca.innerHTML = '';

	const tamat = document.getElementById('selesaiBaca');
	tamat.innerHTML = '';

	const hapusData = document.getElementById('resetData');

	for (const itemBuku of buku) {
		const elemenBuku = tampilkanBuku(itemBuku);

		if (!itemBuku.isComplete) {
			belumTerbaca.append(elemenBuku);
		} else {
			tamat.append(elemenBuku);
		}
	}

	if (buku.length <= 0) {
		hapusData.style.display = 'none';
	} else {
		hapusData.style.display = 'block';
	}
});

document.addEventListener(SAVED_EVENT, () => {
	console.log('Data berhasil di simpan.');
});
