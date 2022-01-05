const queryString = window.location.search;
console.log(queryString.replace("?", ""));
let objktID;

if (!queryString) {
  objktID = 618870;
} else {
  objktID = queryString.replace("?", "");
}
// let objktID = queryString.replace("?", "");
const main = document.getElementById("section");
const link = document.createElement("meta");
const imgMeta = document.createElement("meta");

console.log({ OBJKT: objktID });
// http://hicdex.com/objkt?objkt=149371

function preload() {
  fetchData(objktID)
    .then((data) => showArt(data))
    .then(() => {
      dataFinishedLoading = true;
    });
}

const query = `
  query Objkt($id: bigint!) {
    hic_et_nunc_token_by_pk(id: $id) {
      artifact_uri
      creator {
        address
        name
      }
      description
      display_uri
      id
      level
      mime
      royalties
      supply
      thumbnail_uri
      metadata
      timestamp
      title
      token_tags(order_by: {id: asc}) {
        tag {
          tag
        }
      }
      swaps(order_by: {id: asc}) {
        price
        timestamp
        status
        amount
        amount_left
        creator {
          address
          name
        }
      }
      trades(order_by: {timestamp: asc}) {
        amount
        buyer {
          address
          name
        }
        seller {
          address
          name
        }
        swap {
          price
        }
        timestamp
      }
      token_holders(where: {quantity: {_gt: "0"}}, order_by: {id: asc}) {
        quantity
        holder {
          address
          name
        }
      }
      hdao_balance
      extra
    }
  }
`;

async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch("https://api.hicdex.com/v1/graphql", {
    method: "POST",
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });
  // console.log(result);
  return await result.json();
}

async function fetchData(objktId) {
  const { errors, data } = await fetchGraphQL(query, "Objkt", { id: objktID });
  if (errors) {
    console.error(errors);
  }
  const result = data.hic_et_nunc_token_by_pk;
  console.log({ result });
  return result;
}
preload();

function showArt(data) {
  main.innerHTML = "";
  const artEl = document.createElement("div");
  artEl.classList.add("nft");
  artEl.innerHTML = `
<div class="showcase">
        <div class="artist">
          <a href="https://www.hicetnunc.art/${data.creator.name}/creations">${
    data.creator.name
  }</a>
          <h2>
            <a href="https://www.hicetnunc.art/objkt/${data.id}">OBJKT#${
    data.id
  }</a>
          </h2>
        </div>
        <div class="art">
      <video
             width="90%"
             controls
             playsinline
             loop
             poster="https://ipfs.io/ipfs/${data.display_uri.replace(
               "ipfs:/",
               ""
             )}""
           >
             <source
               src="https://ipfs.io/ipfs/${data.artifact_uri.replace(
                 "ipfs:/",
                 ""
               )}"
             />
             Your browser does not support the video tag.
           </video>
         
        </div>
        <div class="OBJKT">
          <h2>${data.title}</h2>
          <a href="https://www.hicetnunc.art/objkt/${data.id}">Buy on HEN</a>
        </div>
        <div class="edition">
          ${data.supply} Editions  -  ${data.mime}
        </div>
        <div class="description">
          ${data.description}
        </div>
      </div>
      `;
  main.appendChild(artEl);
  const link = document.createElement("meta");
  const imgMeta = document.createElement("meta");
  link.setAttribute("name", "twitter:title");
  link.content = data.title + " created by " + data.creator.name;
  document.getElementsByTagName("head")[0].appendChild(link);
  imgMeta.setAttribute("name", "og:image");
  imgMeta.content =
    "https://ipfs.io/ipfs/" + data.display_uri.replace("ipfs://", "");
  document.getElementsByTagName("head")[0].appendChild(imgMeta);
}

// Next option
//         <img
//           src="https://ipfs.io/ipfs/${data.display_uri.replace("ipfs:/", "")}"
//           alt="${data.title}">
//  <video
//             width="90%"
//             controls
//             playsinline
//             loop
//             poster="https://ipfs.io/ipfs/${data.display_uri.replace(
//               "ipfs:/",
//               ""
//             )}""
//           >
//             <source
//               src="https://ipfs.io/ipfs/${data.artifact_uri.replace(
//                 "ipfs:/",
//                 ""
//               )}"
//             />
//             Your browser does not support the video tag.
//           </video>
//         <div class="arist-info">
//           <h3>${data.creator.name}</h3>
//         </div>
//         <div class="overview">
//           <h3>Overview</h3>
//           ${data.description}
//         </div>
