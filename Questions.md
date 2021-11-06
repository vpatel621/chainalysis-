## Questions

Short responses to four questions about the engineering design

## Are there any sub-optimal choices (or short cuts taken due to limited time) in your implementation?

Careful decisions were made about the design of the product, but due to time constraints, there were short cuts taken. However these decisions do not have any impact on the performance of the app because of the small scale the project is. One choice was to use a in server cache to store results from a fetch request. In a more real world setting, using an external cache system such as Redis to store the results of latest crypto prices would allow for better scalability. Another lacking feature in my product are not enough tests. Given more time, I could have implemented more tests that would provide better coverage and reduce potential bugs.

## Is any part of it over-designed?

I do not feel like I over-designed my product, however, I do think it is efficiently designed both from the perspectives of a system and for users. I chose to keep the interface simple and not bombard users with too much information, which allows them to notice price changes based on color changes and the best available best and sell prices are easily.

## If you have to scale your solution to 100 users/second traffic what changes would you make, if any?

In order to scale for a 100 users, I may not have to make any changes as my server should be able to handle a 100 simultaneous users. However, in order to scale my app in general, I would choose to horizontally scale my app. I chose to use a publish subscribe pattern to provide updates to users using server sent events. I would continue to use these two design choices because they scale well, however, I would have to add a reverse proxy load balancer such as nginx to direct traffic to multiple servers instead of just the one server I have currently. I would continue to do fetch requests on the backend and would publish the data to a Redis cache and have all my servers subscribe to changes to the Redis cache so that they can update users of changes in prices.

## What are some other enhancements you would have made, if you had more time for this implementation?

As previously mentioned, I would have loved to included a Redis cache and more tests. In addition, since most people who buy cryptocurrencies own more than just Bitcoin and Ethereum, I would add all the major cryptocurrencies found at the largest exchanges. I would also add in next three largest exchanges so that users can get a true idea of which exchange is giving the best price for a certain currency. Other small features I would add is factoring in fees for total buy and sell prices based on the exchange, offering external links to allow for such transactions to take place, and prices in other fiat currencies besides just USD.
