/// <reference path="../../Friday.Base/Transport/IPacketRegistryRouteRegistration.ts" />
/// <reference path="../../Friday.Base/Transport/IMessageSend.ts" />
namespace Friday.Knockout.Chat {
    import RoutedViewModel = Knockout.ViewModels.RoutedViewModel;
    import IPacketRegistryRouteRegistration = Transport.IPacketRegistryRouteRegistration;
    import IMessageSend = Transport.IMessageSend;

    export interface ISubmitFlag {
        PropertyName: string;
        PropertyValue: any;
    }

    export interface IChannelCfg {
        Id: number;
        Name: string;
        MessageLimit: number;
    }

    export interface IChatCfg {
        Channels: Array<IChannelCfg>;
        SubmitFlags?: Array<ISubmitFlag>;
        SwitchChannelHandler?: Function;
    }

    export interface IOutgoingChatMessage {
        [Key: string]: any;
        Message: string;
        Channel: number;
    }

    export class ChatMessage {
        public Id: number;
        public Name: string;
        public Text: string;
        public Date: Date;
        public AvatarPath: string;

        constructor(id: number, name: string, text: string, date: Date, avatarPath: string) {
            this.Id = id;
            this.Name = name;
            this.Text = text;
            this.Date = date;
            this.AvatarPath = avatarPath;
        }
    }

    export class ChatChannel {
        public readonly Id: number;
        public readonly Name: string;
        public readonly MessageLimit: number;
        public readonly Log: KnockoutObservableArray<ChatMessage> = ko.observableArray([]);

        constructor(cfg: IChannelCfg) {
            this.Id = cfg.Id;
            this.Name = cfg.Name;
            this.MessageLimit = cfg.MessageLimit;
        }

        public LoadHistory(history: Array<ChatMessage>) {
            this.Log.removeAll();
            this.Log(history);
            this.deleteOldMessages();
        }

        public AddMessage(message: ChatMessage) {
            this.Log.push(message);
            this.deleteOldMessages();
        }

        private deleteOldMessages() {
            while (this.Log().length > this.MessageLimit) {
                this.Log.remove(this.Log()[0]);
            }
        }
        

    }

    export interface IChatChannelControl {
        CurrentChannel: KnockoutObservable<string>;
    }

    export abstract class ChatViewModel extends RoutedViewModel implements IChatChannelControl {
        public readonly Channels: Array<ChatChannel> = [];
        public readonly CurrentChannel: KnockoutObservable<string>;
        public readonly MessageText: KnockoutObservable<string> = ko.observable("");
        public readonly Visible: KnockoutObservable<boolean> = ko.observable(false).extend({Cookie: "isChatVisible"});
        private readonly submitFlags: Array<ISubmitFlag> = [];
        private readonly switchChannelHandler: Function;

        public Submit() {
            if (this.MessageText().length == 0) return;
            var message: IOutgoingChatMessage = {
                Channel: this.GetChannelByName(this.CurrentChannel()).Id,
                Message: this.MessageText()
            };
            for (var i = 0; i < this.submitFlags.length; i++) {
                message[this.submitFlags[i].PropertyName] = this.submitFlags[i].PropertyValue;
            }
            this.sendMessage(message);
            this.MessageText("");
        }

        public SwitchChannel(channelName: string) {
            this.CurrentChannel(channelName);
            if(typeof(this.switchChannelHandler) != "undefined")
                this.switchChannelHandler();
        }

        public ClearHistory() {
            for (var i = 0; i < this.Channels.length; i++) {
                this.Channels[i].Log.removeAll();
            }
        }

        public KeyPress(data: any, event: KeyboardEvent) {
            if (event.keyCode == 13) {
                this.Submit();
                return false;
            } else {
                return true;
            }
        }

        public GetChannelByName(name: string): ChatChannel {
            for (var i = 0; i < this.Channels.length; i++) {
                if (this.Channels[i].Name == name) return this.Channels[i];
            }
        }

        constructor(cfg: IChatCfg, transport: IMessageSend, registry: IPacketRegistryRouteRegistration) {
            super(transport, registry);
            for (var i = 0; i < cfg.Channels.length; i++) {
                this.Channels.push(new ChatChannel(cfg.Channels[i]));
            }
            this.CurrentChannel = ko.observable(this.Channels[0].Name);
            this.switchChannelHandler = cfg.SwitchChannelHandler;
            if (cfg.SubmitFlags.length > 0)
                this.submitFlags = cfg.SubmitFlags;

        }
    }
}