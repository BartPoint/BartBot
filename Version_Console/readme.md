<h1>BartBot</h1>

Setup Code :

  - You need to have a sub AllDebird to do that and replace this value :

```
if (typeof agentName == 'undefined') agentName = "ENTER HERE";
if (typeof apiKey == 'undefined') apiKey = "ENTER HERE";
```

  - So as you can see "ENTER HERE" need to be replace by your APIKey / AgentName 
  - You can get your own on this link : https://alldebrid.com/apikeys/ (Create a new API KEY)

After replace all that just save 

Now go to your brownser if you don't have Chrome you need to launch the script anytime i recommend you to use Chrome. 

If you want to use it without Chrome 

  - Open DevTools (All brownser have one)
  - Go to console 
  - And past the code here directly when you are already in the link of your series/movies you want to download.

If you have Chrome follow this :

  - Open DevTools -> F12 
  - Go to Source
  - Find Snippeds Section
  - Create a New Snippet
  - Name them "BartBot.js"
  - And past the code with the Setup Code already done !

Now close the DevTools tabs.

Concrete example :

  - Go to Extreme-Down
  - Search a movie or serie
  - When you have found one 
  - Click on it 
  - And you just have to open DevTools (remember F12 work)
  - Go to Console 
 
 You now have different options :
 
 **Main option** : Write **BartBot()** and the script will detect which site you are directly on and automatically retrieve all the uptobox links and unblock them 
 
 **Manually Redirect fail** : Sometimes the API AllDebrid return 503 error (means that the call fails) soo you after you exec Main option and get issue 503 or else you will get a message said *Error retry manually with this link ... to retry manually type allDebridDownload...* soo you will normally get the link to launch the Manually Unblock just do **allDebridRedirectManually("with the link")**
 
 **Manually Download fail** : Sometimes it's the same thing as for the redirection soo you are going to get a message like that *Error retry manually with this link ... to retry manually type allDebridDownload* soo you will normally get the link to launch Manually Download just do **allDebridDownload("with the link")**
 
Well that all :) for the V2 Addons idk for that moment => **NEW :** *the extension has been made :)*

<h1>NO LONGER AVAILABLE maybe i will make update sometime but for the moment this projet is in pause</h1>