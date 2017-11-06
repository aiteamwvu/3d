var filesQueue = [];
        var isRunning = false;
        function drop_handler(ev) {
            ev.preventDefault();
            var dt = ev.dataTransfer;
            if (dt.items) {
                for (var i=0; i < dt.items.length; i++) {
                    var item = dt.items[i];
                    if (item.kind == "file") {
                        var entry = item.webkitGetAsEntry();
                        if (entry.isDirectory) {
                            traverseFileTree(entry);
                        } else {
                            var file = dt.items[i].getAsFile();
                            enqueueFile(file);
                        }
                    }
                }
            }
        }
        function dragend_handler(ev) {
            var dt = ev.dataTransfer;
            if (dt.items) {
                for (var i = 0; i < dt.items.length; i++) {
                    dt.items.remove(i);
                }
            } else {
                ev.dataTransfer.clearData();
            }
        }
        function traverseFileTree(item, path) {
            path = path || "";
            if (item.isFile) {
                item.file(function(file) {
                    enqueueFile(file);
                });
            } else if (item.isDirectory) {
                var dirReader = item.createReader();
                dirReader.readEntries(function(entries) {
                    for (var i=0; i<entries.length; i++) {
                        traverseFileTree(entries[i], path + item.name + "/");
                    }
                });
            }
        }
        function dragover_handler(ev) {
            var fr = new FileReader();
            ev.preventDefault();
        }
        function enqueueFile(file) {
            filesQueue.push(file);
            if (isRunning == false) {
                processFiles();
            }
        }
        function appendResult(content) {
            $("#results").append("<p>" + content + "</p>")
        }
        function processFiles() {
            if (filesQueue.length > 0) {
                isRunning = true;
                var file = filesQueue.pop();
                appendResult("Uploading: " + file.name);
                var fr = new FileReader();
                fr.onload = function(e) {
                    var fileContent = e.target.result;
                    var mimeType = e.target.result.match(/:(.*?);/)[1];
                    uploadContent(file.name, mimeType, e.target.result.replace(/^.*,/, ''));
                }
                fr.readAsDataURL(file);
            } else {
                isRunning = false;
                appendResult("All the files were uploaded");
            }
        }
        function uploadContent(fileName, mimeType, content) {
            $.post('https://script.google.com/a/aiwvu.ml/macros/s/AKfycbxSRfm3cNWE9LtTjOt3Qru3O1L9IdfIsoIpw1ROkF3HBNtXO5rP/exec', {
                filename: fileName,
                mimeType: mimeType,
                file: content
            }, function(result){
                console.log(result);
                appendResult("Uploaded <a href='" + result.value + "' target='_blank'>here</a>");
                processFiles();
            });
        }
