import { ITEMLIST } from "./ITEMLIST.js";

//console.dir을 이용하여 객체의 더 자세한 속성들 확인
const allSection = document.querySelector("#all");
const albumSection = document.querySelector('#album');
const movieSection = document.querySelector('#movie');
const travelSection = document.querySelector('#travel');

//console.log(allSection, albumSection, movieSection, travelSection); //정상적으로 가져오는지 확인

const allList = document.querySelector("#allList");
const albumList = document.querySelector("#albumList");
const movieList = document.querySelector("#movieList");
const travelList = document.querySelector("#travelList");

//console.log(allList, albumList, movieList, travelList);
//console.dir(allList, albumList, movieList, travelList); //이벤트 뭘 사용할 수 있을지 파악

const closeOtherSection = () => {
  //console.log("지금 closeOtherSection 함수가 호출되었습니다.");
  /*********************
   * console.dir로 확인해보면, 요소.style.diplay 의 값이 null 이다.
   * 이외에도, 다른 모든 style들의 프로퍼티가 null로 되어있다.
   * 그 이유는, 기본적으로 위와 같은 .(dot)방식의 접근은, 인라인 스타일 요소만 가져올 수 있기 때문이다.
   * 따라서, 외부에서 CSS를 적용한 것을 반영하여 프로퍼티를 확인하려면, 
   * <window.getComputedStyle(요소).프로퍼티> 형식의 메서드를 활용해야 한다 - 공유해놓음
   *********************/
    
  let isAllOpen = window.getComputedStyle(allSection).display; //allSection.style.display; 
  let isAlbumOpen =  window.getComputedStyle(albumSection).display;//albumSection.style.display;
  let isMovieOpen =  window.getComputedStyle(movieSection).display;//movieSection.style.display;
  let isTravelOpen =  window.getComputedStyle(travelSection).display;//travelSection.style.display;
  //console.log(isAllOpen);
  //console.log(`${isAllOpen}`);
  //전시되고 있는 섹션은 안보이게 바꿈
  if(isAllOpen === "flex")
  {
    allSection.style.display = "none"; 
    console.log("allSection 사라짐!");
  }
    
  if(isAlbumOpen === "flex")
  {
    albumSection.style.display = "none";
    console.log("albumSection 사라짐!");
  }
    
  if(isMovieOpen === "flex")
  {
    movieSection.style.display = "none";
    console.log("movieSection 사라짐!");
  }
    
  if(isTravelOpen === "flex")
  {
    travelSection.style.display = "none";
    console.log("travelSection 사라짐!");
  }
  
}

const openList = (e) => {
  //console.log("지금 openList 함수가 호출되었습니다.");
  //console.log(`you click ${e.currentTarget}`);
  //console.log(e.currentTarget);
  const list = e.currentTarget; //그냥 target하면 정확히 a 클릭시 자식요소인 해당요소만 인식

  closeOtherSection();
  //console.log(`지금 클릭한 리스트의 아이디는 ${list.id} 입니다.`); // id 접근가능한가 확인
  switch(list.id)
  {
    case "allList":
      allSection.style.display = "flex"; /*중요! 위에서 언급했지만, 이는 인라인 스타일을 적용하는 것이고, 우선순위가 높아진다*/
      break; //break 꼭 써주기! 처음에 까먹고 안 썼다가 전부 렌더링 됨.
    case "albumList":
      albumSection.style.display = "flex";
      break;
    case "movieList":
      movieSection.style.display = "flex";
      break;
    case "travelList":
      travelSection.style.display = "flex";
      break;
  }
}

//console.dir(allList);
//잘 동작하긴 하는데 console.dir로 확인했을 때 왜 onclick이 null로 나올까? 
//코드의 반복인데, 이를 좀 더 간단하게 쓰는 방법은 없을까?
allList.addEventListener('click', openList);
albumList.addEventListener('click', openList); 
movieList.addEventListener('click', openList); 
travelList.addEventListener('click', openList);  

