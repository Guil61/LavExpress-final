import { useState } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { motion } from "framer-motion";

export type TimeSlot = {
    time: string;
    available: boolean;
};

interface DateTimeSelectorProps {
    onSelect: (date: Date, time: string) => void;
}

export default function DateTimeSelector({ onSelect }: DateTimeSelectorProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // Generate 7 days starting from today
    const generateDays = () => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            days.push(addDays(new Date(), i));
        }
        return days;
    };

    const days = generateDays();

    // Mock time slots
    const timeSlots: TimeSlot[] = [
        { time: "09:00", available: true },
        { time: "10:00", available: true },
        { time: "11:00", available: false },
        { time: "12:00", available: true },
        { time: "13:00", available: false },
        { time: "14:00", available: true },
        { time: "15:00", available: true },
        { time: "16:00", available: true },
        { time: "17:00", available: true },
    ];

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setSelectedTime(null);
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        onSelect(selectedDate, time);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Selecionar Data</h3>
                    <div className="flex space-x-2">
                        <button className="p-1 rounded-full hover:bg-gray-100">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button className="p-1 rounded-full hover:bg-gray-100">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {days.map((day) => {
                        const isSelected = isSameDay(day, selectedDate);
                        const isToday = isSameDay(day, new Date());

                        return (
                            <motion.button
                                key={day.toISOString()}
                                whileTap={{ scale: 0.95 }}
                                className={`flex flex-col items-center justify-center min-w-16 h-20 rounded-xl border ${
                                    isSelected
                                        ? "border-primary bg-primary/5 text-primary"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => handleDateSelect(day)}
                            >
                <span className="text-xs font-medium mb-1">
                  {format(day, "E", { locale: ptBR })}
                </span>
                                <span className="text-2xl font-bold">{format(day, "d")}</span>
                                {isToday && (
                                    <span className="text-xs text-primary font-medium mt-1">
                    Hoje
                  </span>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="font-medium">Selecionar Horário</h3>
                <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => {
                        const isSelected = selectedTime === slot.time;

                        return (
                            <motion.button
                                key={slot.time}
                                whileTap={{ scale: 0.95 }}
                                disabled={!slot.available}
                                className={`relative flex items-center justify-center py-3 rounded-lg border ${
                                    !slot.available
                                        ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                                        : isSelected
                                            ? "border-primary bg-primary text-white"
                                            : "border-gray-200 hover:border-gray-300"
                                }`}
                                onClick={() => slot.available && handleTimeSelect(slot.time)}
                            >
                                <span className="font-medium">{slot.time}</span>
                                {isSelected && (
                                    <div className="absolute right-2">
                                        <Check className="h-3.5 w-3.5" />
                                    </div>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
