var data
var page = 1
var pageSize = 10
var lastPageIndex = 1
fetch("./movies.json", { mode: "cors", }).then(response => response.json()).then(res => {
    data = res

    var li = document.createElement("li");
    var a = document.createElement("a")
    a.onclick = prev()
    a.innerHTML = "<span>back</span>"
    a.href = "javascript:void(0)"
    li.appendChild(a)
    document.getElementById('pagination').appendChild(li)
    
    var li = document.createElement("li");
    var a = document.createElement("a")
    a.onclick = next()
    a.innerHTML = "<span>next</span>"
    a.href = "javascript:void(0)" // 点击链接后，页面不动，只打开链接
    li.appendChild(a)
    document.getElementById('pagination').appendChild(li)
    genreoptions(data);
    showAllData(data.slice(0, (page * pageSize) + 1))
})
var inputcontent = ''
var startyear = ''
var endyear = ''
const selectedmovies = new Array()
const searchedmovies = new Array()
var sGenre = ''

function initialise() {
    const selectYearStart = document.getElementById("selectYearStart")
    for (var i = 1900; i <= 2018; i++) {
        let option = document.createElement("option");
        option.text = option.value = i;
        selectYearStart.add(option);
    }
    const selectYearEnd = document.getElementById("selectYearEnd")
    for (var i = 2018; i >= 1900; i--) {
        let option = document.createElement("option");
        option.text = option.value = i;
        selectYearEnd.add(option);
    }
    document.getElementById("selectYearStart").onchange = judging
    document.getElementById("selectYearEnd").onchange = judging
    document.getElementById("namesearchbutton").onclick = searching

}
function next() {
    var maxPage = Math.ceil(data.length / 10)
    if (page < maxPage) {
        page += 1
        lastPageIndex += 10
        rebindData()
    }
}
function prev() {
    if (page > 1) {
        page -= 1
        lastPageIndex -= 10
        rebindData()
    }
}



function genreoptions(arr) {
    let genreoption = new Set()
    genreoption.add("All")
    for (var i = 0; i < arr.length; i++) {
        for (var n of arr[i].genres) {
            genreoption.add(n)
        }
    }
    const selectGenre = document.getElementById("selectGenre")
    if (null != selectGenre) {
        for (var i of genreoption) {
            let option = document.createElement("option")
            option.text = i
            selectGenre.add(option)
        }
    }
}

function deleteAllData() {
    var table = document.getElementById("movieTable")
    var rows = table.rows
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].cells[0].innerText == 'Year') {
            continue
        }
        table.deleteRow(i)
        var rows = table.rows
        i = 0
    }
}

//
i=1
do {
    table.deleteRow(1)
    i++
} while (i< row.length)
//



function showAllData(arr) {
    console.log(arr)
    document.getElementById("tdby").innerHTML = ''
    for (var i = 0; i < arr.length; i++) {
        let table = document.getElementById("movieTable")
        let row = document.getElementById("tdby").insertRow(-1)
        let year = row.insertCell(-1)
        let title = row.insertCell(-1)
        let genres = row.insertCell(-1)
        let cast = row.insertCell(-1)
        let wikilink = row.insertCell(-1)
        cast.style = "word-break:break-all;word-wrap:break-word"
        genres.style = "word-break:break-all;word-wrap:break-word"
        title.innerText = arr[i].title
        year.innerText = arr[i].year
        if (arr[i].cast == null) {
            cast.innerText = "N/A"
        } else {
            cast.innerText = arr[i].cast.join(", ")
        }

        if (arr[i].genres == null) {
            genres.innerText = "N/A"
        } else {
            genres.innerText = arr[i].genres.join(", ")
        }
        
        wikilink.innerText = createLink(arr[i].title)
    }
}

function selectGenreChang() {

    rebindData()
    const table = document.getElementById("movieTable")
    const rows = table.rows
    if (sGenre === 'All') {
        sGenre = ''
        showAllData(data.slice(lastPageIndex, (page * pageSize) + 1));
    } else {
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].cells[0].innerText == 'Year') {
                continue
            }
            let rowYear = rows[i].cells[2].innerText
            if (rowYear != sGenre) {
                table.deleteRow(i)
                const rows = table.rows
                i = 0

            }
        }
    }

    console.log("o")
}

function judging() {

    rebindData()
    const table = document.getElementById("movieTable")
    const rows = table.rows
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].cells[0].innerText == 'Year') {
            continue
        }
        let rowYear = parseInt(rows[i].cells[0].innerText)
        if (!(rowYear <= endyear && rowYear >= startyear)) {
            table.deleteRow(i)
            const rows = table.rows
            //console.log(rows.length)
            i = 0
        }

    }
    //console.log("o")
}
function rebindData() {
    deleteAllData();
    showAllData(data.slice(lastPageIndex, (page * pageSize) + 1));
    extract()
}
function searching() {
    rebindData()

    judging()
    const table = document.getElementById("movieTable")
    const rows = table.rows
    for (var i = 0; i < rows.length; i++) {
        if (rows[i].cells[0].innerText == 'Year') {
            continue
        }
        if (rows[i].cells[1].innerText.indexOf(inputcontent) == -1 && rows[i].cells[3].innerText.indexOf(inputcontent) == -1) {
            table.deleteRow(i);
            //const rows = table.rows
            //console.log(rows.length)
            i = 0
        }
    }
    //console.log("d")
}
function extract() {
    startyear = parseInt(getSelectionValue("selectYearStart"))
    endyear = parseInt(getSelectionValue("selectYearEnd"))
    sGenre = getSelectionValue("selectGenre")
    console.log(sGenre)
    inputcontent = document.getElementById('input').value;   
}


function getSelectionValue(id) {

    var i = document.getElementById(id).selectedIndex;

    return document.getElementById(id).options[i].innerText;
}

function createLink(m) {
    let link = document.createElement("a")
    link.href = "https://en.wikipedia.org/wiki/"
    link.href = link.href + m
    return link
}

function removeData() {
    let t = document.getElementById("movieTable")
    t.removeChild(t.document.getElementById("tbody"))
}
window.onload = initialise;


