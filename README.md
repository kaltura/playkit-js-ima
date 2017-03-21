# playkit-js-sample-plugin

_**Steps to test the sample plugin:**_
1. In the project, run `npm start`
2. Open browser on `http://localhost:8080`
3. Open developer tools.
4. In the console, create the player as following:

        let p = Playkit.playkit({
          plugins: {
            'samplePlugin': {}
          }
        });
      
      or with a plugin config:
      
         let p = Playkit.playkit({
           plugins: {
             'samplePlugin': {
               'size': 10,
               'firstCellValue': 4,
               'lastCellValue': 6
             }
           }
         });
         
5. See the logs which reflects the plugin creation flow.
5. In the console, start to play the media: `p.play()`
6. Observe the changes in the DOM.
