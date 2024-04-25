import { ITEMLIST } from "./js/utils/ITEMLIST.js";
const ITEM_LIST_KEY = "itemList";

//console.dir을 이용하여 객체의 더 자세한 속성들 확인 가능.

// 매번 렌더링시마다 filter해서 요소들을 걸러내는게 비효율적이라 판단.
// 따라서 미리 필터링 된 요소들을 저장해 둠.
// 참고로, const로 선언한 배열 자체는 수정(대체)이 불가능하지만,
// 배열의 '요소'들은 수정이 가능하다.

// 가져온 결과가 falsy인 경우 빈 배열 할당. (아니면 parse까지 수행하여 배열을 넣음)
const allObjects = localStorage.getItem(ITEM_LIST_KEY) ? JSON.parse(localStorage.getItem(ITEM_LIST_KEY)) : [] ;
const albumObjects = ITEMLIST.filter((obj) => obj.category === "album"); 
const movieObjects = ITEMLIST.filter((obj) => obj.category === "movie"); 
const travelObjects = ITEMLIST.filter((obj) => obj.category === "travel"); 

function removeOtherSection(){
  const all = document.getElementById("all");
  const album = document.getElementById("album");
  const movie = document.getElementById("movie");
  const travel = document.getElementById("travel");

  if(all !== null) //해당 섹션이 존재한다면,
  {
    all.remove(); //해당 섹션 요소 삭제
    console.log("all 섹션 삭제됨");
  }
  else if(album !== null) //else if를 사용한 이유 -> 어차피 하나의 섹션만 렌더링되어 있을것이므로!
  {
    album.remove();
    console.log("album 섹션 삭제됨");
  }
  else if(movie !== null)
  {
    movie.remove();
    console.log("movie 섹션 삭제됨");
  }
  else if(travel !== null)
  {
    travel.remove();
    console.log("travel 섹션 삭제됨");
  }

}

function saveStorage()
{
  localStorage.setItem(ITEM_LIST_KEY, JSON.stringify(allObjects));
}

//item 선택시 alert 창 뜨게 하는 로직(이벤트 리스너)
function addCart(e){
  if(confirm("장바구니에 추가하시겠습니까?")){ //yes를 선택할 시 
    //해당 타겟의 id와 같은 id를 갖는 객체의 인덱스를 탐색 (참고 : find는 객체 자체를 반환)
    const findObjIdx = allObjects.findIndex((obj) => obj.id === parseInt(e.currentTarget.id)); 
    allObjects[findObjIdx].cart = true; //해당 배열에서의 객체 cart 속성을 true로 설정
    saveStorage();
    //console.log(allObjects);
  }
  else{ //no를 선택할 시
    console.log("취소!");
  }
}

//renderSection : 섹션을 렌더링 하기 위한 함수 ,  
const renderSection = (id, title, arr) =>{
  const mainContainer = document.querySelector("#mainContainer");

  removeOtherSection();
  
  //섹션을 만들고, 제목까지 붙이는 로직
  const section = document.createElement("section"); //스트링을 인자로...!
  section.classList.add("flexSection"); //setAttribute 사용시 아예 초기화됨. 따라서 덧붙일 수 있도록 classList.add 사용
  section.setAttribute("id", id); //그냥 section.id = "id명"; 이라해도 같은 효과이긴 하다. (dir로 확인해보니 가능함)
  mainContainer.appendChild(section);

  const h2 = document.createElement("h2");
  h2.innerText = title;
  section.appendChild(h2);

  //console.log(`섹션의 아이디는 : ${section.id} 입니다.`)
  //console.log(`${h2.innerText}섹션이 렌더링 시작됩니다.`);
  //console.log("현재 가져온 배열: ", arr);
  arr.forEach((obj)=>{
    const article = document.createElement("article");
    article.classList.add("productCard");
    //굳이 id를 추가시키는 이유는, 다른 객체들과 구분하여 장바구니에 추가하기 위한 로직에 활용하기 위함이다.
    article.setAttribute("id", obj.id); 
    article.addEventListener("click", addCart); //바로 click 이벤트 붙여놓음
    section.appendChild(article);

    const img = document.createElement("img");
    img.classList.add(obj.category);
    img.setAttribute("src", obj.img);
    article.appendChild(img);

    const heartIcon = document.createElement("i");
    heartIcon.classList.add("fa-solid");
    heartIcon.classList.add("fa-heart");
    article.appendChild(heartIcon);

    const h4 = document.createElement("h4");
    h4.innerText = obj.name;
    article.appendChild(h4);

    const p = document.createElement("p");

    // 천자리 단위로 ,를 찍도록 변환 ! (toString 함수를 안쓸 것!)
    // 단, 반드시 **숫자형 데이터**에 .toLocaleString()을 써야한다. 
    //-인자 없으면, 브라우저의 현재 언어 설정을 확인하여 로컬을 결정하고, 그에 맞는 인자를 넣어준다.
    p.textContent = (obj.price).toLocaleString('ko-KR'); //string을 숫자로 변환하여 넣음, 그리고 실습에서 사용했던 textContent를 사용해봄
    // https://hianna.tistory.com/441 참고
    article.appendChild(p);
    
  });
};


//renderCategory : 특정 섹션을 판단하고 renderSection 호출하는 함수
function renderCategory(e){
  const list = e.currentTarget //자식 요소 눌렀을 때, 다른 거 안 가져오도록 일부러 current 타겟으로 함
  switch(list.id)
  {
    case "allList":
      console.log("all 섹션 리렌더링 시작");
      renderSection("all", "전체", allObjects);
      break; //break 꼭 써주기! 
    case "albumList":
      console.log("album 섹션 리렌더링 시작");
      renderSection("album", "앨범", albumObjects);
      break;
    case "movieList":
      console.log("movie 섹션 리렌더링 시작");
      renderSection("movie", "영화", movieObjects);
      break;
    case "travelList":
      console.log("travel 섹션 리렌더링 시작");
      renderSection("travel", "여행", travelObjects);
      break;
  }
}

/*****처음에 계속 all말고 다른거 렌더링 안되길래 디버깅 계속 해봤는데
 * 허무하게도 예전에 작성해놓은 display:none 속성 때문이었음 - 현재는 css상에서 삭제 완료
 * 문제가 발생할 시, inspector -> element의 요소들을 활용하여 바로 디버깅해볼 것.
 * *****/

//************ 카테고리에 렌더링하는 이벤트 리스너 부착******************
const allList = document.querySelector("#allList");
const albumList = document.querySelector("#albumList");
const movieList = document.querySelector("#movieList");
const travelList = document.querySelector("#travelList");

allList.addEventListener('click', renderCategory);
albumList.addEventListener('click', renderCategory); 
movieList.addEventListener('click', renderCategory); 
travelList.addEventListener('click', renderCategory);  


//************오른쪽 sideModal 열고 닫는 로직 (클래스와 애니메이션을 활용)************
const openingLeft = (e) => {
  const modalRight = document.querySelector("#modalRight");
  modalRight.classList.add("openingLeft");
  modalRight.classList.remove("closingRight");
}
const openLeft = document.querySelector("#threeBar");
openLeft.addEventListener("click", openingLeft)

const closingRight = (e) => {
  e.currentTarget.parentNode.classList.add("closingRight");
  e.currentTarget.parentNode.classList.remove("openingLeft"); //기존 애니메이션을 없애야함 - 그래야 나중에 다시 적용할 때, 적용되는 모습이 보임
}
const closeRight = document.querySelector("#closeModal");
closeRight.addEventListener("click", closingRight);


//****************** 함수 실행 부분 ******************
renderSection("all", "전체", ITEMLIST);
