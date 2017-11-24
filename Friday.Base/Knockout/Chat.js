var ChatLib;
(function (ChatLib) {
    var ChatMessage = (function () {
        function ChatMessage(id, name, text, date, avatarPath) {
            this.Id = id;
            this.Name = name;
            this.Text = text;
            this.Date = date;
            this.AvatarPath = avatarPath;
        }
        return ChatMessage;
    }());
    ChatLib.ChatMessage = ChatMessage;
    var ChatChannel = (function () {
        function ChatChannel(cfg) {
            this.Log = ko.observableArray([]);
            this.Id = cfg.Id;
            this.Name = cfg.Name;
            this.MessageLimit = cfg.MessageLimit;
        }
        ChatChannel.prototype.LoadHistory = function (history) {
            this.Log.removeAll();
            this.Log(history);
            this.deleteOldMessages();
        };
        ChatChannel.prototype.AddMessage = function (message) {
            this.Log.push(message);
            this.deleteOldMessages();
        };
        ChatChannel.prototype.deleteOldMessages = function () {
            while (this.Log().length > this.MessageLimit) {
                this.Log.remove(this.Log()[0]);
            }
        };
        return ChatChannel;
    }());
    ChatLib.ChatChannel = ChatChannel;
    var Chat = (function () {
        function Chat(cfg) {
            this.Channels = [];
            this.MessageText = ko.observable("");
            this.Visible = ko.observable(false).extend({ Cookie: "isChatVisible" });
            this.submitFlags = [];
            for (var i = 0; i < cfg.Channels.length; i++) {
                this.Channels.push(new ChatChannel(cfg.Channels[i]));
            }
            this.CurrentChannel = ko.observable(this.Channels[0].Name);
            this.submitHandler = cfg.SubmitHandler;
            this.switchChannelHandler = cfg.SwitchChannelHandler;
            if (cfg.SubmitFlags.length > 0)
                this.submitFlags = cfg.SubmitFlags;
        }
        Chat.prototype.Submit = function () {
            if (this.MessageText().length == 0)
                return;
            var message = {
                Channel: this.GetChannelByName(this.CurrentChannel()).Id,
                Message: this.MessageText()
            };
            for (var i = 0; i < this.submitFlags.length; i++) {
                message[this.submitFlags[i].PropertyName] = this.submitFlags[i].PropertyValue;
            }
            this.submitHandler(message);
            this.MessageText("");
        };
        Chat.prototype.SwitchChannel = function (channelName) {
            this.CurrentChannel(channelName);
            if (typeof (this.switchChannelHandler) != "undefined")
                this.switchChannelHandler();
        };
        Chat.prototype.ClearHistory = function () {
            for (var i = 0; i < this.Channels.length; i++) {
                this.Channels[i].Log.removeAll();
            }
        };
        Chat.prototype.KeyPress = function (data, event) {
            if (event.keyCode == 13) {
                this.Submit();
                return false;
            }
            else {
                return true;
            }
        };
        Chat.prototype.GetChannelByName = function (name) {
            for (var i = 0; i < this.Channels.length; i++) {
                if (this.Channels[i].Name == name)
                    return this.Channels[i];
            }
        };
        return Chat;
    }());
    ChatLib.Chat = Chat;
})(ChatLib || (ChatLib = {}));
//# sourceMappingURL=Chat.js.map