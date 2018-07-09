schema od the document of the system is as below. The status field indicates whether the car is available(1) or not(0).
GET on /cars should json of all documents which are available for renting. 
POST on/cars/:carid/reserve accepts the name, license of the driver and set the start mileage by reading the end mileage of
the last record of rantalDetails of the car. set the end mileage to null for now.
DELETE on /cars/:carid/cancel/reservationId - removes the reservation. 

Finally create a mongodb by db name: usa and collection: cars - just to run the code as it is.

{
        "_id" : 2,
        "model" : "Toyota",
        "status" : 0,
        "rentalDetails" : [
                {
                        "reservation_id" : 1002,
                        "driverName" : "Mark",
                        "license" : "AD110",
                        "startMileage" : 100,
                        "endMileage" : 150
                },
                {
                        "reservation_id" : 1003,
                        "driverName" : "Smith",
                        "license" : "AD111",
                        "startMileage" : 153,
                        "endMileage" : 200
                }
        ],
        "ratePerDay" : 55
}