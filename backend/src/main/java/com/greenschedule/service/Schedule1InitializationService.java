package com.greenschedule.service;

import com.greenschedule.model.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class Schedule1InitializationService {
    private final ScheduleTypeService scheduleTypeService;
    private final PartService partService;
    private final DefectOptionService defectOptionService;

    @Transactional
    public void initializeSchedule1() {
        // Create Schedule Type
        ScheduleType schedule1 = scheduleTypeService.createIfNotExists(
            "Schedule 1",
            "Systems and Components Defects for Commercial Trucks"
        );

        // Initialize all parts
        initializeAirBrakeSystem(schedule1);
        initializeCab(schedule1);
        initializeCargoSecurement(schedule1);
        initializeCouplingDevices(schedule1);
        initializeDangerousGoods(schedule1);
        initializeDriverControls(schedule1);
        initializeDriverSeat(schedule1);
        initializeElectricBrakeSystem(schedule1);
        initializeEmergencyEquipment(schedule1);
        initializeExhaustSystem(schedule1);
        initializeFrameAndCargoBody(schedule1);
        initializeFuelSystem(schedule1);
        initializeGeneral(schedule1);
        initializeGlassAndMirrors(schedule1);
        initializeHeaterDefroster(schedule1);
        initializeHorn(schedule1);
        initializeHydraulicBrakeSystem(schedule1);
        initializeLampsAndReflectors(schedule1);
        initializeSteering(schedule1);
        initializeSuspensionSystem(schedule1);
        initializeTires(schedule1);
        initializeWheelsHubsAndFasteners(schedule1);
        initializeWindshieldWiperWasher(schedule1);
    }

    private void createDefectOptions(Part part, List<String> defects, boolean isMajor) {
        defects.forEach(defect -> {
            defectOptionService.createIfNotExists(DefectOption.builder()
                .part(part)
                .description(defect)
                .isMajorDefect(isMajor)
                .build());
        });
    }

    private void initializeAirBrakeSystem(ScheduleType scheduleType) {
        Part part = partService.createIfNotExists(Part.builder()
            .name("Part 1. Air Brake System")
            .scheduleType(scheduleType)
            .build());

        createDefectOptions(part, List.of(
            "audible air leak",
            "slow air pressure build-up rate"
        ), false);

        createDefectOptions(part, List.of(
            "pushrod stroke of any brake exceeds the adjustment limit",
            "air loss rate exceeds prescribed limit",
            "inoperative towing vehicle (tractor) protection system",
            "low air warning system fails or system is activated",
            "inoperative service, parking or emergency brake"
        ), true);
    }

    private void initializeCab(ScheduleType scheduleType) {
        Part part = partService.createIfNotExists(Part.builder()
            .name("Part 2. Cab")
            .scheduleType(scheduleType)
            .build());

        createDefectOptions(part, List.of(
            "occupant compartment door fails to open"
        ), false);

        createDefectOptions(part, List.of(
            "any cab or sleeper door fails to close securely"
        ), true);
    }

    private void initializeCargoSecurement(ScheduleType scheduleType) {
        Part part = partService.createIfNotExists(Part.builder()
            .name("Part 3. Cargo Securement")
            .scheduleType(scheduleType)
            .build());

        createDefectOptions(part, List.of(
            "insecure or improper load covering"
        ), false);

        createDefectOptions(part, List.of(
            "insecure cargo",
            "absence, failure, malfunction or deterioration of required cargo securement device or load covering"
        ), true);
    }

    private void initializeCouplingDevices(ScheduleType scheduleType) {
        Part part = partService.createIfNotExists(Part.builder()
            .name("Part 4. Coupling Devices")
            .scheduleType(scheduleType)
            .build());

        createDefectOptions(part, List.of(
            "coupler or mounting has loose or missing fastener"
        ), false);

        createDefectOptions(part, List.of(
            "coupler is insecure or movement exceeds prescribed limit",
            "coupling or locking mechanism is damaged or fails to lock",
            "defective, incorrect or missing safety chain or cable"
        ), true);
    }

    private void initializeDangerousGoods(ScheduleType scheduleType) {
        Part part = partService.createIfNotExists(Part.builder()
            .name("Part 5. Dangerous Goods")
            .scheduleType(scheduleType)
            .build());

        createDefectOptions(part, List.of(
            "no minor defect"
        ), false);

        createDefectOptions(part, List.of(
            "dangerous goods requirements not met"
        ), true);
    }

    private void initializeDriverControls(ScheduleType scheduleType) {
        Part part = partService.createIfNotExists(Part.builder()
            .name("Part 6. Driver Controls")
            .scheduleType(scheduleType)
            .build());

        createDefectOptions(part, List.of(
            "accelerator pedal, clutch, gauges, audible and visual indicators or instruments fail to function properly"
        ), false);

        createDefectOptions(part, List.of(
            "no major defect"
        ), true);
    }

    private void initializeDriverSeat(ScheduleType scheduleType) {
        Part part = partService.createIfNotExists(Part.builder()
            .name("Part 7. Driver Seat")
            .scheduleType(scheduleType)
            .build());

        createDefectOptions(part, List.of(
            "seat is damaged or fails to remain in set position"
        ), false);

        createDefectOptions(part, List.of(
            "seatbelt or tether belt is insecure, missing or malfunctions"
        ), true);
    }

    private void initializeElectricBrakeSystem(ScheduleType scheduleType) {
        Part part = partService.createIfNotExists(Part.builder()
            .name("Part 8. Electric Brake System")
            .scheduleType(scheduleType)
            .build());

        createDefectOptions(part, List.of(
            "loose or insecure wiring or electrical connection"
        ), false);

        createDefectOptions(part, List.of(
            "inoperative breakaway device",
            "inoperative brake"
        ), true);
    }

    private void initializeEmergencyEquipment(ScheduleType scheduleType) {
        Part part = partService.createIfNotExists(Part.builder()
            .name("Part 9. Emergency Equipment and Safety Devices")
            .scheduleType(scheduleType)
            .build());

        createDefectOptions(part, List.of(
            "emergency equipment is missing, damaged or defective"
        ), false);

        createDefectOptions(part, List.of(
            "no major defect"
        ), true);
    }

    private void initializeExhaustSystem(ScheduleType scheduleType) {
        Part part = partService.createIfNotExists(Part.builder()
            .name("Part 10. Exhaust System")
            .scheduleType(scheduleType)
            .build());

        createDefectOptions(part, List.of(
            "exhaust leak, except as described in Column 3"
        ), false);

        createDefectOptions(part, List.of(
            "leak that causes exhaust gas to enter the occupant compartment"
        ), true);
    }

    private void initializeFrameAndCargoBody(ScheduleType scheduleType) {
        Part part = partService.createIfNotExists(Part.builder()
            .name("Part 11. Frame and Cargo Body")
            .scheduleType(scheduleType)
            .build());

        createDefectOptions(part, List.of(
            "damaged frame or cargo body"
        ), false);

        createDefectOptions(part, List.of(
            "visibly shifted, cracked, collapsing or sagging frame member"
        ), true);
    }

    private void initializeFuelSystem(ScheduleType scheduleType) {
        Part part = partService.createIfNotExists(Part.builder()
            .name("Part 12. Fuel System")
            .scheduleType(scheduleType)
            .build());

        createDefectOptions(part, List.of(
            "missing fuel tank cap"
        ), false);

        createDefectOptions(part, List.of(
            "insecure fuel tank",
            "dripping fuel leak"
        ), true);
    }

    private void initializeGeneral(ScheduleType scheduleType) {
        Part part = partService.createIfNotExists(Part.builder()
            .name("Part 13. General")
            .scheduleType(scheduleType)
            .build());

        createDefectOptions(part, List.of(
            "no minor defect"
        ), false);

        createDefectOptions(part, List.of(
            "serious damage or deterioration that is noticeable and may affect the vehicle's safe operation"
        ), true);
    }

    private void initializeGlassAndMirrors(ScheduleType scheduleType) {
        Part part = partService.createIfNotExists(Part.builder()
            .name("Part 14. Glass and Mirrors")
            .scheduleType(scheduleType)
            .build());

        createDefectOptions(part, List.of(
            "required mirror or window glass fails to provide the required view to the driver as a result of being cracked, broken, damaged, missing or maladjusted",
            "required mirror or glass has broken or damaged attachments onto vehicle body"
        ), false);

        createDefectOptions(part, List.of(
            "no major defect"
        ), true);
    }

    private void initializeHeaterDefroster(ScheduleType scheduleType) {
        Part part = partService.createIfNotExists(Part.builder()
            .name("Part 15. Heater / Defroster")
            .scheduleType(scheduleType)
            .build());

        createDefectOptions(part, List.of(
            "control or system failure"
        ), false);

        createDefectOptions(part, List.of(
            "defroster fails to provide unobstructed view through the windshield"
        ), true);
    }

    private void initializeHorn(ScheduleType scheduleType) {
        Part part = partService.createIfNotExists(Part.builder()
            .name("Part 16. Horn")
            .scheduleType(scheduleType)
            .build());

        createDefectOptions(part, List.of(
            "vehicle has no operative horn"
        ), false);

        createDefectOptions(part, List.of(
            "no major defect"
        ), true);
    }

    private void initializeHydraulicBrakeSystem(ScheduleType scheduleType) {
        Part part = partService.createIfNotExists(Part.builder()
            .name("Part 17. Hydraulic Brake System")
            .scheduleType(scheduleType)
            .build());

        createDefectOptions(part, List.of(
            "brake fluid level is below indicated minimum level"
        ), false);

        createDefectOptions(part, List.of(
            "brake boost or power assist is not operative",
            "brake fluid leak",
            "brake pedal fade or insufficient brake pedal reserve",
            "activated (other than ABS) warning device",
            "brake fluid reservoir is less than ¼ full",
            "parking brake is inoperative"
        ), true);
    }

    private void initializeLampsAndReflectors(ScheduleType scheduleType) {
        Part part = partService.createIfNotExists(Part.builder()
            .name("Part 18. Lamps and Reflectors")
            .scheduleType(scheduleType)
            .build());

        createDefectOptions(part, List.of(
            "required lamp does not function as intended",
            "required reflector is missing or partially missing"
        ), false);

        createDefectOptions(part, List.of(
            "When use of lamps is required: failure of both low-beam headlamps",
            "When use of lamps is required: failure of both rearmost tail lamps",
            "At all times: failure of a rearmost turn-indicator lamp",
            "At all times: failure of both rearmost brake lamps"
        ), true);
    }

    private void initializeSteering(ScheduleType scheduleType) {
        Part part = partService.createIfNotExists(Part.builder()
            .name("Part 19. Steering")
            .scheduleType(scheduleType)
            .build());

        createDefectOptions(part, List.of(
            "steering wheel lash (free-play) is greater than normal"
        ), false);

        createDefectOptions(part, List.of(
            "steering wheel is insecure, or does not respond normally",
            "steering wheel lash (free-play) exceeds prescribed limit"
        ), true);
    }

    private void initializeSuspensionSystem(ScheduleType scheduleType) {
        Part part = partService.createIfNotExists(Part.builder()
            .name("Part 20. Suspension System")
            .scheduleType(scheduleType)
            .build());

        createDefectOptions(part, List.of(
            "air leak in air suspension system",
            "a broken spring leaf",
            "suspension fastener is loose, missing or broken"
        ), false);

        createDefectOptions(part, List.of(
            "damaged (patched, cut, bruised, cracked to braid or deflated) air bag or insecurely mounted air bag",
            "cracked or broken main spring leaf or more than one broken spring leaf in any spring assembly",
            "part of spring leaf or suspension is missing, shifted out of place or is in contact with another vehicle component",
            "loose U-bolt"
        ), true);
    }

    private void initializeTires(ScheduleType scheduleType) {
        Part part = partService.createIfNotExists(Part.builder()
            .name("Part 21. Tires")
            .scheduleType(scheduleType)
            .build());

        createDefectOptions(part, List.of(
            "damaged tread or sidewall of tire",
            "tire leaking, if leak cannot be heard"
        ), false);

        createDefectOptions(part, List.of(
            "flat tire",
            "tire leaking, if leak can be felt or heard",
            "tire tread depth is less than wear limit",
            "tire is in contact with another tire or any vehicle component other than mud-flap",
            "tire is marked \"Not for highway use\"",
            "tire has exposed cords in the tread or outer sidewall area"
        ), true);
    }

    private void initializeWheelsHubsAndFasteners(ScheduleType scheduleType) {
        Part part = partService.createIfNotExists(Part.builder()
            .name("Part 22. Wheels, Hubs and Fasteners")
            .scheduleType(scheduleType)
            .build());

        createDefectOptions(part, List.of(
            "hub oil below minimum level (when fitted with sight glass)",
            "leaking wheel seal"
        ), false);

        createDefectOptions(part, List.of(
            "wheel has loose, missing or ineffective fastener",
            "damaged, cracked or broken wheel, rim or attaching part",
            "evidence of imminent wheel, hub or bearing failure"
        ), true);
    }

    private void initializeWindshieldWiperWasher(ScheduleType scheduleType) {
    	   Part part = partService.createIfNotExists(Part.builder()
    	       .name("Part 23. Windshield Wiper / Washer")
    	       .scheduleType(scheduleType)
    	       .build());

    	   createDefectOptions(part, List.of(
    	       "control or system malfunction",
    	       "wiper blade is damaged, missing or fails to adequately clear driver's field of vision"
    	   ), false);

    	   createDefectOptions(part, List.of(
    	       "When use of wipers or washer is required: wiper or washer fails to adequately clear driver's field of vision in area swept by driver's side wiper"
    	   ), true);
    	}
}