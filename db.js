import sqlite from "sqlite3";
const sqlite3 = sqlite.verbose();
const db = new sqlite3.Database("./mcu.db", sqlite3.OPEN_READWRITE, (err) => {
  if (err) console.log(err.message);
});

export const CreateTable = () => {
  let sql = `Create table Places(id integer primary key, place_id , name, full_name, lat, lng, description, placeType, visitPurpose, erLevel, entryPrice, optimalTime, constraints, 
    bestTimeMonths,bestTimeDays, bestTime, opensOnMonths,opensOnDays, opensOnTime)`;
  db.run(sql, [], (err) => {
    if (err) return console.log(err.message);
  });
};

export const insertIntoTable = async (placeData,
  callback
) => {
   const{place_id,name,fullname,lat,lng,
    description,placeType,
    visitPurpose,erLevel,
    entryPrice,optimalHours,constraints,
    bestTimeToVisit,
    opensOn
   } = placeData;
    
  db.all(
    `SELECT id  FROM places where place_id = "${place_id}" `,
    async function (err, rows) {
      if (rows.length == 0) {
        let sql = `Insert into places(place_id,name, full_name,lat,lng, description, placeType, visitPurpose, erLevel, entryPrice, optimalTime, constraints, 
          bestTimeMonths,bestTimeDays, bestTime, opensOnMonths,opensOnDays, opensOnTime) 
          values("${place_id}","${name}","${fullname}","${lat}","${lng}",
          "${description}","${placeType}","${visitPurpose}",
          "${erLevel}","${entryPrice}","${optimalHours}","${constraints}",
          "${bestTimeToVisit.months}","${bestTimeToVisit.days}","${bestTimeToVisit.hours}",
          "${opensOn.months}","${opensOn.days}","${opensOn.hours}")`;
        await db.run(sql, [], (err) => {
          if (err) return console.log(err.message);
          callback({
            success: true,
          });
        });
        // callback({
        //   success: true,
        // });
      } else {
        callback({
          success: false,
          message: "Place already exists",
        });
      }
    }
  );
  // let sql = `Insert into places(place_id,name, full_name,lat,lng) values("${placeId}","${name}","${full_name}","${lat}","${lng}")`;
  // await db.run(sql, [], (err) => {
  //   if (err) return console.log(err.message);
  // });
};

export const getAll = (value, callback) => {
  let sql;
  if (value == "") sql = "select * from places LIMIT 50";
  else
    sql = `select * from places where name like "%${value}%" or full_name like "%${value}%" LIMIT 50`;

  let data = [];
  db.all(sql, [], (err, rows) => {
    if (err) return console.log(err.message);
    // console.log(rows);
    callback(rows);
  });
};

// sql = `Insert into places(place_id,place_name,lat,lng) values("11","22","33","44")`;
// db.run(sql, [], (err) => {
//   if (err) return console.log(err.message);
// });
