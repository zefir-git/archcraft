import ServerPacket from "../../ServerPacket.js";
import PingPacket from "../client/PingPacket.js";

export default class PongPacket extends ServerPacket {
    public static readonly id = 0x01;

    public constructor(c2s: PingPacket) {
        super(Buffer.concat([
            ServerPacket.writeVarInt(0x01),
            ServerPacket.writeLong(c2s.data.payload),
        ]));
    }
}
