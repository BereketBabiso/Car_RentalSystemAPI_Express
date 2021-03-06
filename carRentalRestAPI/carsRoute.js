const express = require('express');


var router = express.Router();

//get all cars that are available for renting(docs with status:1)
router.get('/',(req,resp)=>{
    var conn = req.conn;
    
    conn.then(db=>{
        var dbo = db.db('usa');
        dbo.collection('cars').find({status:1}).toArray((err,docs)=>{
            if(err) throw err;
            resp.status(200).json(docs);
        })
    }).catch(err=>console.log('error'));
});

router.post('/:id/reserve',(req,resp)=>{
    var conn = req.conn;
    var carId = parseInt(req.params.id);
    var name = req.body.name;
    var license = req.body.license;
  
    conn.then(db=>{
        db.db('usa').collection('cars').find({_id:carId}).toArray((err,doc)=>{
            if(err) throw err;
            console.log(doc[0]);
            var rentDetails = doc[0].rentalDetails;
            var len = rentDetails.length;
            var rentalId = rentDetails[len-1].id +1; //new rental id generated by incrementing the last on
            var lastMileage = rentDetails[len-1].endMileage;
            var obj ={'id':rentalId,'driverName':name,'license':license,'startMileage':lastMileage,'endMileage':null};
            rentDetails.push(obj);//update the rental_details
            //now reserve the car----the status has to be 0 now
            db.db('usa').collection('cars').update({_id:carId},{'$set':{status:0,rentalDetails:rentDetails}},(err,updated)=>{
                if(err) throw err;
                resp.status(201).json({'success':'ok','reservation id':rentalId});
            });
        });
    }).catch(err=>console.log('error from db'));
});

router.delete('/:id/cancel/:reservation_id',(req,resp)=>{
    var conn = req.conn;
    var carId = parseInt(req.params.id);
    var reservation_id = parseInt(req.params.reservation_id);

    conn.then(db=>{
        db.db('usa').collection('cars').find({_id:carId}).toArray((err,doc)=>{
            if(err) throw err;
            var rentDetails = doc[0].rentalDetails;
            var len = rentDetails.length;
            var rentalDetailAfterDel = [];
            var currentCarStatus = doc[0].status;
            var count=0; 
            for(let rd of rentDetails){
                if(reservation_id==rd.id) {
                   count++;//if the reservation is the last in the array, then this value will be 1
                }
                else{ rentalDetailAfterDel.push(rd);}                
            }
            if(currentCarStatus==0 && count==1) currentCarStatus=1;//make the car availabel
            db.db('usa').collection('cars')
            .update({_id:carId},{'$set':{status:currentCarStatus,rentalDetails:rentalDetailAfterDel}},(err,updated)=>{
                if(err) throw err;
                resp.json({'success':'reservation canceled'});
            });

        });
    });
});







module.exports = router;