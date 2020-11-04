const express = require('express');
const businessRoutes = express.Router();
var request = require('request');
const cron = require('node-cron');
const mongoose = require("mongoose");
// Require Business model in our routes module
let Monitor = require('../models/bussiness.model');

// Defined store route
businessRoutes.route('/add').post(function (req, res) {
  //let url_to_monitor = new Monitor(req.body);
  /* url_to_monitor.save()
    .then(urls => {
      res.status(200).json({'message': 'urls added successfully'});
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    }); */
    cron.schedule('*/5 * * * *', function() {
  const u = req.body.url
  request.get({ url: u, time: true }, function (err, response) {
    if (response) {
      console.log('The  actual time elapsed:', response.elapsedTime);
      const sc=response.statusCode
      const et = response.elapsedTime;
      console.log('after:' + response.elapsedTime)
      if(sc == 200 || sc == 301)
      {
if(response.elapsedTime<=5000)
{
  console.log(sc)
  const url_to_monitor = new Monitor({
    _id: new mongoose.Types.ObjectId(),
    url: req.body.url,
    status: sc,
    uptime: et
  });

  url_to_monitor.save()
    .then(result => {

      res.json({
        message: 'Data added successfully',
        datas: result
      })

    })
    .catch(err => {
      res.json({
        message: 'an error occured!!',
        error: err
      })
    })
}
else{
  const url_to_monitor = new Monitor({
    _id: new mongoose.Types.ObjectId(),
    url: req.body.url,
    status: response.statusCode,
    uptime: et
  });

  url_to_monitor.save()
    .then(result => {

      res.json({
        message: 'your website is down',
        datas: result
      })

    })
    .catch(err => {
      res.json({
        message: 'an error occured!!',
        error: err
      })
    })

}
      }
      else{
        const url_to_monitor = new Monitor({
          _id: new mongoose.Types.ObjectId(),
          url: req.body.url,
          status: response.statusCode,
          uptime: et
        });
      
        url_to_monitor.save()
          .then(result => {
      
            res.json({
              message: 'your website is not available',
              datas: result
            })
      
          })
          .catch(err => {
            res.json({
              message: 'an error occured!!',
              error: err
            })
          })
      
      }
    }
  })
    })

})
 

// Defined get data(index or listing) route
businessRoutes.route('/').get(function (req, res) {
  
      cron.schedule('*/5 * * * *', function() {
        Monitor.distinct('url', (error,links)=>{
          console.log(res)
          //Monitor.find({ sort: { 'createdAt': -1 }}).distinct('url', function(error, links)=>{
            console.log('length' + links.length)
            for(i=0; i<links.length;i++)
            {
                console.log("links disp:" + links[i])
           const u=links[i];
                   
                     let start_time = new Date().getTime();
                 
                     request.get(u, function (err, response) {
                         console.log('Time elapsed since queuing the request:', new Date().getTime() - start_time);
                     });
                     
                     request.get({ url: links[i], time: true }, function (err, response) {
                         if(response){
                             console.log('The actual time elapsed:', response.elapsedTime);
                   const sc = response.statusCode
                   
                    console.log('after:'+response.elapsedTime)
                    
                        if(response.elapsedTime <= 5000 )
                        {
                            console.log('dvdsds'+ u)
                            const Entrydata = new Entry({
                                _id: new mongoose.Types.ObjectId(),
                                url:u,
                                statuscheck: sc,
                                uptime:response.elapsedTime
                              });
                                
                              Entrydata.save()
                              .then(result=>{
                               
                                res.json({
                                    message : 'your site is up and datas added',
                                    availability : response.statusCode,
                                    datas : result
                                })
                                 
                              })
                              .catch(err=>{
                                res.json({
                                      message : 'an error occured!!',
                                      error : err
                                  })
                              })
                            /* res.json({
                                message : 'your site is up'
                            }) */
                        }
                        else {
                            const Entrydata = new Entry({
                                _id: new mongoose.Types.ObjectId(),
                                url:u,
                                statuscheck: response.statusCode,
                                uptime:response.elapsedTime
                              });
                                
                              Entrydata.save()
                              .then(result=>{
                               
                                res.json({
                                    message : 'Your website is down',
                                    datas : result
                                })
                                 
                              })
                              .catch(err=>{
                                res.json({
                                      message : 'an error occured!!',
                                      error : err
                                  })
                              })
                            /* res.json({
                                message : 'your site is up'
                            }) */
                        }
                         }
                 if(err)
                 {
                     const Entrydata = new Entry({
                         _id: new mongoose.Types.ObjectId(),
                         url:u,
                         statuscheck: 404,
                         uptime:0
                       });
                         
                       Entrydata.save()
                       .then(result=>{
                        
                         res.json({
                             message : 'your site is not available',
                             error : err
                         })
                          
                       })
                       .catch(err=>{
                         res.json({
                               message : 'an error occured!!',
                               error : err
                           })
                       })
                     /* res.json({
                         message : 'your site is up'
                     }) */
                 }
                 });
                     
                 
            }
            
            
        })
        })
    
    
  });




// Defined edit route
businessRoutes.route('/edit/:id').get(function (req, res) {
  let id = req.params.id;
  Monitor.findById(id, function (err, aurl) {
    res.json(aurl);
  });
});

//  Defined update route
businessRoutes.route('/update/:id').post(function (req, res) {
  Monitor.findById(req.params.id, function (err, aurl) {
    if (!aurl)
      res.status(404).send("data is not found");
    else {
      business.person_name = req.body.person_name;
      business.business_name = req.body.business_name;
      business.business_gst_number = req.body.business_gst_number;

      business.save().then(aurl => {
        res.json('Update complete');
      })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// Defined delete | remove | destroy route
businessRoutes.route('/delete/:id').get(function (req, res) {
  Monitor.findByIdAndRemove({ _id: req.params.id }, function (err, aurl) {
    if (err) res.json(err);
    else res.json('Successfully removed');
  });
});

module.exports = businessRoutes;